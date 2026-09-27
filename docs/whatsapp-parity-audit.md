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
  and verified in the second deployed batch.
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
  On desktop it is a centered modal occupying 80% of the viewport, rather
  than a narrow side drawer; the reference header combines tabs with search,
  ordering, selection and close controls.
- The authenticated Windows reference session remains available through Agent
  Jake. New chat searches name, number or username and exposes New group,
  New contact and New community before the contact directory.
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
| Composer optimistic sends, paste and voice recording | Verified | Multi-file picker/paste/drop, captions, per-file retry and background batch tests pass |
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
| Chat export / clear / delete / lock | Partial | TXT export of synchronized history verified; clear/delete/lock pending |
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
- Pin-message documentation currently differs from the installed rc13 source:
  this version accepts `{ pin: messageKey, type, time }`, not nested pin
  options. Its protobuf enum uses `PIN_FOR_ALL=1`, `UNPIN_FOR_ALL=2`; the
  public README example suggesting `0` for unpin must not be copied. Allowed
  durations are 24 hours, 7 days and 30 days. Pin persistence/UI is still pending.

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

Second composer batch (`dd52a98`), deployed and validated:

- App tests: 195/195 passing; selected-feature browser suite: 39 checks.
- Synthetic composer browser QA covers picker/paste/drop, valid image previews,
  captions, unique send tokens, partial failures and retry with the original
  token, fake camera capture/cancellation and focus containment.
- A delayed multi-file upload continues against the captured account/chat when
  the view changes and preserves the next draft. No real messages were sent.
- Desktop light/dark and mobile staging screenshots were visually inspected.
- Authenticated production QA verifies the new menu entries, outside-click
  dismissal and staging/removing two files with zero sends and no page errors.
  Both connectors and the app are healthy; fork CI passes on this exact commit.
- The new-sticker entry opens the existing WebP uploader; a full sticker editor
  and per-image crop/annotation are still pending.

Attachment menu visual correction (`2c4cbf4`), deployed and validated:

- Official option order and measured icon colors; theme-aware background.
- Both themes pass the minimum 4.5:1 text contrast check in Playwright.
- Authenticated staging/removal check passes with no sends or page errors.
- Fork and upstream PR checks pass for the published menu correction.

TXT export batch, validated with synthetic data:

- Reads every available message page using the real `before` cursor contract.
- Keeps the starting account/chat, orders messages chronologically, deduplicates
  IDs and uses the browser timezone. Attachment content is not downloaded.
- Reports progress and supports cancellation, including the final pending page.
  Closing the panel or switching account/chat cancels the download.
- Repeated/malformed cursors, failed pages and the 50,000-message memory ceiling
  produce an explicit error, never a partial file. Missing media retains a
  placeholder in the transcript rather than silently dropping the message.
- Fifteen module tests and browser download/error/cancellation checks pass.
  The existing selected-feature browser suite still passes all 39 checks.
- Real user conversations were not exported during QA.
- Authenticated production verification opens/cancels the export panel without
  downloading user content; zero page errors. Responsive synthetic screenshots:
  [mobile light](screenshots/parity-export-mobile.png) and
  [desktop dark](screenshots/parity-export-desktop.png).

UTC timestamp decoding correction (`38fdbab`), deployed and validated:

- The connector writes UTC to `timestamp without time zone` columns. The app
  container runs in Europe/Madrid, where the default PostgreSQL decoder was
  interpreting stored UTC as local time. A read-only production comparison of
  20 timestamps against their original provider epoch found a -7,200,000 ms
  offset for every sample; no message contents were extracted.
- The app pool now decodes these scalar timestamps as UTC, without changing
  the database, host timezone, global PostgreSQL parsers or browser formatting.
- Tests cover UTC, Madrid, New York and Kolkata, winter/summer and DST changes.
  Existing zoned timestamps retain their original parser; cursor text retains
  PostgreSQL's microsecond precision.
- The exact Node 22 image passes 212 tests. After deployment, all 20 production
  samples have zero offset; authenticated read-only browser QA passes with no
  page errors or downloads. Refreshing an already open tab replaces timestamps
  and pagination cursors fetched before the correction.

Typed chat-list previews, validated before deployment:

- The list query carries the last visible message's real type alongside its
  text, with a deterministic tie-breaker for equal timestamps. Icons represent
  photos, videos, audio, documents, stickers, polls, locations, contacts and
  events, retaining captions. Ordinary text such as "Imagen" stays ordinary text.
- Known types no longer trigger a second database lookup to label captionless
  media. Account-scoped fallback lookups remain for incomplete projections.
- The isolated Node 22 candidate passes 214 app tests and 40 synthetic browser
  checks. A read-only query against both deployed accounts confirms that all
  current chat rows expose a type, including six media previews.

The goal remains open until the matrix is resolved with implemented/verified
behavior or a concrete documented provider limitation. Calls/video calls are
the only product area excluded by the owner.
