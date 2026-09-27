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
- Communities displays community headings, announcement/subgroup rows, a
  full-group-list entry and community creation.
- UI inspection does not authorize sending messages, publishing updates,
  joining/leaving communities or modifying other people's chats during QA.
  Private screenshots and contact/message contents are not repository fixtures.

## Delivery matrix

`Existing` means implementation found in source, not that every edge case has
passed this audit. `In validation` means changes in this work batch. `Pending`
means work remains; it must not be hidden by a disabled or cosmetic control.

| Area | Current state | Remaining work / verification |
| --- | --- | --- |
| Accounts, independent chat identity, Hermes sessions | Existing | Regression coverage across account changes |
| Chat filters, archived, favorites and lists | Existing | Bulk select/read actions; provider synchronization of lists |
| Pinned ordering and mute marker | In validation | Browser QA and deployment |
| Full available message history | In validation | Cursor paging, scroll preservation and concurrent polling |
| More than 500 chats | Pending | Chat-list pagination |
| Quote reply, edit, delete, forward and selection | Existing | Official menu details and limits |
| Copy message / jump from quote to original | In validation | Browser keyboard and historical quote tests |
| Reactions and polls | Existing | Full emoji picker; current official results/detail UX |
| Pinned messages and event RSVP | Pending | Provider contracts, ingestion and UI |
| Search and media/link/document gallery per chat | Existing | Date/sender/type filters; global media browser |
| Composer optimistic sends, paste and voice recording | Existing | Multi-attachment staging and caption semantics |
| Camera, media editing and view-once | Pending | Capture, crop/rotate/annotation, provider semantics |
| Emoji / GIF / stickers | Partial | Full picker/search, sticker creation and packs |
| Location and live location | Partial | Received locations render; sending not implemented |
| Link and map previews | Existing | Reference QA and failure states |
| New chats / contact creation | Existing | Browsable contact directory and account profile/about |
| Group subject and description editing | In validation | Admin controls, errors and browser QA |
| Group member administration | Existing | Invite links, group photo, leave and full settings |
| Settings drawer / wallpaper / spellcheck / Enter preference | In validation | Desktop/mobile, light/dark, persistence |
| Web-session logout | In validation | OIDC local-session revocation; keep connector paired |
| Own profile and account settings | Pending | Real name/photo/about APIs and controls |
| Privacy and disappearing messages | Partial | Full privacy fields, blocked list, current values |
| Notifications | Partial | Per-type preferences, sound, preview, title count; closed-tab push |
| Keyboard shortcuts | In validation | Supported shortcuts only; focus/IME conflicts |
| Presence | Partial | Composing/recording labels in validation; live event delivery remains |
| Real-time updates | Partial | Authenticated events; current message/presence polling remains |
| Communities | In validation | Real list/detail/create/admin operations; provider read-only QA |
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
- Connector tests in the production Node 22 image: 154/154 passing.
- `selected-features.playwright.mjs`: 39 browser checks passing.
- `parity-panels.playwright.mjs`: desktop/mobile in both themes; settings
  geometry/preferences/logout contract, admin versus member communities,
  late account responses and opening an archived linked group.
- Connector TypeScript, lint, MCP contract and Compose configuration pass.
- Application and both connector images build successfully.
- Synthetic screenshots: [settings](screenshots/parity-settings-desktop.png)
  and [communities](screenshots/parity-communities-mobile.png).

Production verification is still required before changing the delivery matrix
from `In validation` to verified. No provider mutation was executed by these tests.

Each delivery batch needs account-scoped API/connector tests, browser QA with
synthetic data, and authenticated read-only deployment checks. Test fixtures
must not call live mutation routes. Do not declare a provider operation
successful for a malformed, null, partial or failed result.

The goal remains open until the matrix is resolved with implemented/verified
behavior or a concrete documented provider limitation. Calls/video calls are
the only product area excluded by the owner.
