# WhatsApp Web parity audit

Audit date: 2026-09-27. Scope: all feasible WhatsApp Web functionality except
voice and video calls, retaining SocialMedia accounts and the Hermes assistant.
This supersedes the earlier selected subset in `whatsapp-selected-features.md`.
The audit is ongoing; this document is not a claim of complete parity.

## Evidence

- Official WhatsApp Web was inspected in an authenticated desktop Chrome session.
  The initial QR pairing failure was bypassed by using the owner's working session.
- Official navigation includes Chats, Status, Channels, Communities, Media, and
  a personal settings/profile section. Meta AI is represented by SocialMedia's
  existing Hermes integration rather than by impersonating that service.
- The global chat menu exposes New group, Starred messages, Select chats, Mark
  all as read, App lock, and Log out.
- Settings includes Profile, Account, Privacy, Chats, Notifications, Keyboard
  shortcuts, Help, and Log out. Chat preferences include theme, wallpaper,
  upload quality, automatic downloads, spellcheck, emoji substitution and
  Enter to send.
- Status creation offers photos/videos and text; the list separates own status
  and recent updates. Channels offers discovery, following, and creation.
- The attachment menu exposes Document, Photos/videos, Camera, Audio, Contact,
  Poll, Event and New sticker. The initial SocialMedia menu exposed only five
  entries; multi-file staging and the missing capture/audio flows are implemented
  in the second batch, awaiting its deployment checks.
- Communities displays community headings, announcement/subgroup rows, a
  full-group-list entry and community creation.
- The group-header menu exposes Add member, Group info, Search, Select messages,
  Mute notifications, Disappearing messages, Lock chat, Favorites, Lists,
  Export chat, Close chat, Clear chat and Leave group. Group info also exposes
  member changes, removal from a community and reporting. These were inspected
  without executing provider mutations.
- Global Media offers Media, Documents and Links tabs, search and selection.
  Its ordering/filter menu includes All, You, Other people, Newest, Oldest
  and Longest. The existing per-chat gallery does not cover this global view.
- UI inspection does not authorize sending messages, publishing updates,
  joining/leaving communities or modifying other people's chats during QA.
  Private screenshots and contact/message contents are not repository fixtures.

## Delivery matrix

`Existing` means implementation found in source, not that every edge case has
passed this audit. `Verified` means the documented local/live checks passed.
`In validation` means changes in this work batch. `Pending`
means work remains; it must not be hidden by a disabled or cosmetic control.

| Area | Current state | Remaining work / verification |
| --- | --- | --- |
| Accounts, independent chat identity, Hermes sessions | Existing | Regression coverage across account changes |
| Chat filters, archived, favorites and lists | Existing | Bulk select/read actions; provider synchronization of lists |
| Pinned ordering and mute marker | Verified | Synthetic browser QA; deployed |
| Full available message history | Verified | Cursor paging, scroll preservation and concurrent polling covered |
| More than 500 chats | Pending | Chat-list pagination |
| Quote reply, edit, delete, forward and selection | Existing | Official menu details and limits |
| Copy message / jump from quote to original | Verified | Browser keyboard and historical quote tests |
| Reactions and polls | Existing | Full emoji picker; current official results/detail UX |
| Pinned messages and event RSVP | Pending | Provider contracts, ingestion and UI |
| Search and media/link/document gallery per chat | Existing | Date/sender/type filters; global media browser |
| Composer optimistic sends, paste and voice recording | In validation | Multi-file picker/paste/drop, captions, per-file retry and background batch tests pass |
| Camera, media editing and view-once | Partial | Camera capture/cleanup tested; crop/rotate/annotation and view-once pending |
| Emoji / GIF / stickers | Partial | Full picker/search, sticker creation and packs |
| Location and live location | Partial | Received locations render; sending not implemented |
| Link and map previews | Existing | Reference QA and failure states |
| New chats / contact creation | Existing | Browsable contact directory and account profile/about |
| Group subject and description editing | Verified | Admin controls/errors tested with provider fixtures; no live mutation |
| Group member administration | Existing | Invite links, group photo, leave and full settings |
| Settings drawer / wallpaper / spellcheck / Enter preference | Verified | Desktop/mobile, light/dark, persistence |
| Web-session logout | Verified | OIDC local-session revocation; keeps connector paired; Basic auth browser cache remains |
| Own profile and account settings | Pending | Real name/photo/about APIs and controls |
| Privacy and disappearing messages | Partial | Full privacy fields, blocked list, current values |
| Notifications | Partial | Per-type preferences, sound, preview, title count; closed-tab push |
| Keyboard shortcuts | Verified | Supported shortcuts only; focus/IME guards |
| Presence | Partial | Composing/recording labels in validation; live event delivery remains |
| Real-time updates | Partial | Authenticated events; current message/presence polling remains |
| Communities | Verified | Both accounts list/details live; create/admin use provider fixtures only |
| Status | Pending | Event-backed, 24-hour catalogue; explicit publishing audience |
| Channels | Pending | Channel-scoped message identity before enabling persistence/UI |
| Chat export / clear / delete / lock | Pending | Supported semantics and deliberate confirmation flows |
| Accessibility and responsive layouts | Ongoing | Keyboard, focus, small screens and contrasts across features |

## Verified provider boundaries

The installed connector dependency is Baileys 7.0.0-rc13. Its installed source,
not assumptions about the newest documentation, determines the contract.

- Communities APIs exist for list, metadata, linked groups, creation, linking,
  unlinking, membership and settings. A group without a linked parent is **not**
  sufficient evidence that it is a community: require explicit metadata flags.
- Newsletter APIs exist for metadata, follow/unfollow, mute, create, reactions,
  updates and fetching messages. Fetching returns a raw binary node; do not
  treat it as an already normalized message array. No complete followed-channel
  directory/search API was verified in this version.
- Channel server message IDs can repeat across channel JIDs. Existing durable
  storage keyed by account + message ID must be made channel-aware before
  enabling these messages; reactions require the original channel server ID.
- Status messages can be received and published, but no complete active-status
  enumeration API was verified. A catalogue built from received events must
  expire at 24 hours and disclose that unsynchronized items can be missing.
  An absent publication audience must never mean all contacts.
- Provider privacy can withhold photos, presence and last-seen information.
  Display unavailable information honestly, without invented values.

## Validation and release

First implementation batch, validated locally:

- App tests: 192/192 passing.
- Connector tests in the production Node 22 image: 155/155 passing.
- `selected-features.playwright.mjs`: 39 browser checks passing.
- `parity-panels.playwright.mjs`: desktop/mobile in both themes; settings
  geometry/preferences/logout contract, admin versus member communities,
  late account responses and opening an archived linked group.
- Connector TypeScript, lint, MCP contract and Compose configuration pass.
- Application and both connector images build successfully.
- Synthetic screenshots: [settings](screenshots/parity-settings-desktop.png)
  and [communities](screenshots/parity-communities-mobile.png).

The batch is deployed and authenticated read-only browser QA passes on both
accounts: account switching, community listing and linked-group details, settings
layout and Escape handling, with zero JavaScript errors. Direct read-only checks
also covered every listed community's detail response. No provider mutation was
executed by these tests; write flows remain verified by contract/socket fixtures.

Live verification uncovered a rc13 parser defect that nominal API tests missed:
`communityFetchAllParticipating` sends the group-list IQ but looks for
`communities/community` nodes instead of `groups/group`, returning a false empty
list. The integration now uses `groupFetchAllParticipating` and `groupMetadata`
with the explicit `isCommunity` flag, and `groupUpdateDescription` to preserve
description metadata. A regression feeds realistic binary nodes through the
installed `extractGroupMetadata`. `communityLeave` keeps its separate provider
method and checks the subsequent membership list; no live leave was performed.

Each delivery batch needs account-scoped API/connector tests, browser QA with
synthetic data, and authenticated read-only deployment checks. Test fixtures
must not call live mutation routes. Do not declare a provider operation
successful for a malformed, null, partial or failed result.

Second composer batch, locally validated before deployment:

- App tests: 195/195 passing; selected-feature browser suite: 39 checks.
- Synthetic composer browser QA covers picker/paste/drop, valid image previews,
  captions, unique send tokens, partial failures and retry with the original
  token, fake camera capture/cancellation and focus containment.
- A delayed multi-file upload continues against the captured account/chat when
  the view changes and preserves the next draft. No real messages were sent.
- Desktop light/dark and mobile staging screenshots were visually inspected.
- The new-sticker entry opens the existing WebP uploader; a full sticker editor
  and per-image crop/annotation are still pending.

The goal remains open until the matrix is resolved with implemented/verified
behavior or a concrete documented provider limitation. Calls/video calls are
the only product area excluded by the owner.
