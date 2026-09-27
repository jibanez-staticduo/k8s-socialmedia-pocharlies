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
  and recent updates. Its empty text editor exposes emoji, font and palette
  controls plus publish/close; inspected and closed without publishing.
  Channels offers discovery, following, and creation.
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
- Official Privacy separates last-seen visibility (all, contacts, exclusions,
  nobody) from online visibility (all or the last-seen rule). It also exposes
  profile photo, About, status audience, read receipts, groups, blocked contacts,
  unknown-account message protection and disabling link previews. These were
  inspected without changing the owner's preferences; call privacy is excluded.
- Official Notifications exposes separate Messages, Groups and Status settings,
  message previews, outgoing-message sound and background synchronization.
  SocialMedia currently requests browser permission and notifies while its
  page remains open; account-scoped message/group/preview/sound preferences
  are in implementation. Closed-tab push and status notifications remain pending.
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
| More than 500 chats | Verified | Deployed 0e7762c: 243 Node 22 tests, 41 browser checks, 650 active/50 archived PG fixture; both accounts pass read-only live QA |
| Quote reply, edit, delete, forward and selection | Existing | Official menu details and limits |
| Copy message / jump from quote to original | Verified | Browser keyboard and historical quote tests |
| Reactions and polls | Existing | Full emoji picker; current official results/detail UX |
| Pinned messages and event RSVP | Pending | Provider contracts, ingestion and UI |
| Search and media/link/document gallery per chat | Existing | Date/sender/type filters; global media browser in validation |
| Composer optimistic sends, paste and voice recording | Verified | Multi-file picker/paste/drop, captions, per-file retry and background batch tests pass |
| Camera, media editing and view-once | Partial | Camera capture/cleanup tested; crop/rotate/annotation and view-once pending |
| Emoji / GIF / stickers | Partial | Full picker/search, sticker creation and packs |
| Location and live location | Partial | Received locations render; sending not implemented |
| Link and map previews | Existing | Reference QA and failure states |
| New chats / contact creation | In validation | Account-scoped searchable/paginated directory; synthetic drawer QA pending before deployment |
| Group subject and description editing | Verified | Admin controls/errors tested with provider fixtures; no live mutation |
| Group member administration | Existing | Invite links, group photo, leave and full settings |
| Settings drawer / wallpaper / spellcheck / Enter preference | Verified | Desktop/mobile, light/dark, persistence |
| Web-session logout | Verified | OIDC local-session revocation; keeps connector paired; Basic auth browser cache remains |
| Own profile and account settings | Verified | Name/photo/about API and controls deployed; own identity/name and panel verified on both accounts, mutations tested synthetically |
| Privacy and disappearing messages | Partial | Online/group-add fields in validation; preserves existing exclusions. Exclusion editor, About/status audience and blocked list remain |
| Notifications | Partial | Per-type preferences, sound, preview, title count; closed-tab push |
| Keyboard shortcuts | Verified | Supported shortcuts only; focus/IME guards |
| Presence | Partial | Composing/recording labels in validation; live event delivery remains |
| Real-time updates | Partial | Authenticated events; current message/presence polling remains |
| Communities | Verified | Both accounts list/details live; create/admin use provider fixtures only |
| Status | Partial | Account/author-scoped persistence and expiry deployed b727ce6; catalogue/viewer and explicit publishing audience remain |
| Channels | Partial | Channel-scoped identity and ingestion deployed b727ce6; catalogue, timeline and provider actions remain |
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
- Event RSVP needs a version-specific adapter. In installed rc13,
  `process-message.js` emits `eventResponses` entries with `response` and
  `senderTimestampMs`, whereas the protobuf declares `eventResponseMessage`
  and `timestampMs`; the aggregation helper reads another field,
  `eventResponse`. Do not copy the current documentation's aggregation or
  decryption signatures without normalizing the installed runtime shape.
  Sending, persistence and RSVP controls remain unfinished.


## Validation and release

Novedades persistence foundation (`b727ce6`): the exact Node 22 connector
image passes 230 tests and TypeScript. The disposable PostgreSQL 17 harness
verifies additive/idempotent startup, account/channel identity, atomic
client/server reconciliation, status expiry and preservation of legacy history.
Both deployed connectors are healthy; all three new tables exist. Authenticated
read-only browser QA passes for both accounts with no profile writes or page
errors. Catalog APIs, viewers and publishing are separate unfinished work.

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

Typed chat-list previews (`c964c09`), deployed and validated:

- The list query carries the last visible message's real type alongside its
  text, with a deterministic tie-breaker for equal timestamps. Icons represent
  photos, videos, audio, documents, stickers, polls, locations, contacts and
  events, retaining captions. Ordinary text such as "Imagen" stays ordinary text.
- Known types no longer trigger a second database lookup to label captionless
  media. Account-scoped fallback lookups remain for incomplete projections.
- The isolated Node 22 candidate passes 214 app tests and 40 synthetic browser
  checks. A read-only query against both deployed accounts confirms that all
  current chat rows expose a type, including six media previews.
- Authenticated production browser QA switches both accounts through the
  visible account buttons and checks the rendered icons against the API types:
  eight typed icons, no page errors and no live mutations. The deployed image
  carries the matching `c964c09` revision label and the app is healthy.

Own-account profile (`0e1e779`), deployed and validated:

- Name, about, authenticated photo display, upload and
  removal with explicit confirmation. Partial or unknown provider reads do not
  erase known fields or report an unconfirmed write as successful. The isolated
  Node 22 candidate passes 235 app tests, 190 connector tests, TypeScript and
  lint with no errors. Synthetic browser QA checks both themes, mobile sizing,
  account changes and partial readbacks; no live profile was changed.
- Independent review approved the profile batch. The exact committed images
  pass the same 235/190 tests and are deployed to the app and both connectors.
  All three are healthy with revision `0e1e779`. Authenticated read-only browser
  QA verifies connected own identity/name and the profile panel on both accounts,
  with zero profile writes or page errors.
- Fork CI and upstream PR #74 CI both pass on the exact `0e1e779` head.

Chat pagination delivery (`0e7762c`):

- Account/archive-scoped keyset cursors preserve microseconds, order equal
  timestamps by chat ID and handle null dates. Progressive loading retains
  old rows until a refresh finishes and rejects stale account responses and
  repeated cursors. A read-only PG17 fixture traverses 650 active and 50 archived
  chats without loss or duplication. The exact Node 22 release image passes
  243 tests; synthetic browser QA passes 41 checks including opening chat 650.
  Deployed app revision and both connectors are healthy. Live read-only QA
  verifies both accounts with zero mutations and page errors. Fork and upstream
  PR CI pass; upstream S3 passed on retry after a network failure to sum.golang.org.

Profile timeout follow-up (`8a9410a`):

- An About read timeout preserves the other profile fields. Accepted writes
  remain accepted but unconfirmed when readback times out; a write timeout is
  still rejected. Independently reviewed; the exact Node 22 connector image
  passes 192 tests and TypeScript. Both connectors are deployed and healthy.
  Authenticated browser QA verifies both accounts with zero writes/page errors.
  Fork and upstream PR CI both pass on this head.

Next delivery, not yet deployed:

- Global media library: centered desktop modal matching the inspected official
  layout, fullscreen mobile, media/documents/links tabs, search, author/order
  filters, pagination, preview and source-message navigation. Browser QA covers
  38 requests across two accounts, rejects stale requests and provider URLs,
  and checks both themes. Independent review's preview-focus and raised-card
  contrast findings are corrected and retested: minimum text contrast is
  4.65:1 light and 6.49:1 dark across all three tabs, desktop and mobile.
  The rail stays clickable outside the modal. Integration review of mutually
  exclusive panels and authenticated deployment checks remain pending. Multi-selection
  and duration ordering are not implemented by this batch.
- Privacy: online and group-add visibility controls preserve an existing
  contact-exclusion setting when other preferences change. Browser regression
  verifies only the two changed fields are sent, scoped to the current account.
  Saving now locks concurrent submissions, stops subsequent writes after closing
  the dialog or changing account, and advances the baseline after each accepted
  field so retries do not resend successful changes. Existing feature tests
  (15 Node 22 tests and 42 browser checks) pass. The dedicated browser suite
  passes 13 checks including double submission, retrying only a rejected field,
  account changes, close during save, detached old forms and delayed reads.
- Bulk chat selection: archive/unarchive, mute/unmute and read/unread capture
  the account, cancel future writes when scope changes and retry only failed
  selections. Four unit tests and synthetic browser QA pass; independent review
  approved the behavior. No real chat was modified during QA.
- Contact directory: 33 Node 22 tests pass, including deterministic LID/phone
  deduplication and Unicode-safe pagination boundaries. Read-only database
  traversal found 1,340 personal-account identities and seven secondary-account
  identities without duplicate keys. All 165 openable rows matched the archived
  flag of the exact conversation chosen for opening. The long-label and
  dual-chat fixes use synthetic regression cases because those cases are not
  present in the current production data. Dedicated drawer browser QA remains
  pending; these changes are not yet deployed.

The goal remains open until the matrix is resolved with implemented/verified
behavior or a concrete documented provider limitation. Calls/video calls are
the only product area excluded by the owner.

## Interface release candidate

This batch adds the global media library, contact directory, bulk chat selection,
account-scoped notification preferences and privacy controls. Local validation
includes 42 selected-feature browser checks, 29 panel-exclusion checks, 13 privacy
checks and 38 media-library requests across mobile/desktop and both themes.
Production verification and CI for the new commit remain pending.
