# Upstream integration for NAS - 2026-10-24

## Source and scope

- Fork/deployed baseline: b87f2dacbb7d7eee903d0b3b220ebe2c7864e233.
- Published PR74 squash: 8702dd47353f241d3f81caed9965113e02c4e58e.
- Upstream target: 0ecb690333ac25c2c5727b679cc94ab532306c52 (`deploy/prod`).
- The baseline and squash trees are byte-identical. A history-only merge records
  that equivalence before integrating upstream normally, preserving fork history
  without replaying PR74 or discarding conflicts blindly.
- Production target is NAS / whatsapp.staticduo.com / docker.staticduo.com.
  Oppos Harbor/Kubernetes remains a separate installation. Correo bridge source
  is integrated but no new bridge is enabled in the NAS stack.

## Corrections before promotion

Private media, thumbnails, avatars and search responses must revalidate after
server authentication and account/chat visibility checks. ETag and gzip retain
representation-correct validators. Search no longer keeps process-global result
snapshots that can outlive a connector edit, local hiding, or page-limit change.
Chat previews remain only in document memory; legacy persistent preview caches
are purged, and successful logout clears the current cache.

The app retains SocialMedia branding, its original favicon, the NAS page viewport
preference and image-viewer zoom. View-once composition follows the connector's
JPEG/PNG/MP4 allowlist. A missing initial chat-list render from upstream is fixed.
The service worker only handles shipped static assets and keeps its background
refresh alive; code assets revalidate against the deployment.

Document gallery queries retain historical rows with NULL attachment types, and
LID/phone saved-name resolution uses the actual selected column. WhatsApp records
ambiguous send errors with the right SQL bind count while keeping `pending`:
uncertainty never authorizes automatic resend.

Migration settings precede the blocking advisory lock. Published migration 037's
literal timeout is adapted only at execution so the configured run-wide cap also
covers its DDL; SQL files and recorded checksums remain unchanged. New upstream
files 037_messages_deleted_at_column, 040_telegram_send_attempts and
041_participants_prefixed_account remain additive. The NAS migrator and writers
retain dimension 512. Telegram keyed sends require DATABASE_URL, copied from the
existing stack's database configuration without changing the Telegram session.

## Validation

All commands run in an isolated worktree with Node 22.23.3. PostgreSQL integration
uses a disposable PG16.15 instance and a read-only schema/ledger copy from NAS;
no production messages, votes, sends or Hermes turns are used as fixtures.

- `pnpm -r build`: pass.
- `pnpm lint`: pass, existing warnings only.
- `pnpm --filter @mcp-socialmedia/server test --runInBand`: 915 pass, 17 skipped.
- `pnpm --filter @mcp-socialmedia/connector test`: 998 pass, 1 skipped.
- `node --test --test-concurrency=1 apps/whatsapp/test/*.test.mjs`: 701 pass,
  4 skipped without the PostgreSQL environment.
- PostgreSQL native-ID/gallery/alias tests: 2/2, both UUID and BIGINT.
- Migration unit tests: 16/16; integration: 19 pass, 1 historical-fixture skip.
- WhatsApp send-attempt lifecycle against PostgreSQL and focal tests: 28/28.
- Telegram: 93 pass, 8 conditional PostgreSQL cases skipped in the default run;
  the previous upstream audit passed all 101 with a disposable database.
- Instagram: 67/67; shared: 15/15; bridge scaffold: 57/57; Synapse bridge: 34/34.
- `pnpm contract:check`: 77 tools, generated digest unchanged.
- Official hash-pinned checker 188b011: 139 entries pass.
- Playwright in an isolated Docker browser: mobile PWA keyboard/safe areas,
  attachment composer, photo editor, and image zoom on desktop/mobile pass.
  Physical iPhone compositor behavior remains device QA.

Independent review found the persistent-preview and view-once MIME issues; both
were corrected with regressions. The final review and remote CI are reported
separately from local results. Deployment uses published digests, a fresh Compose
backup and a verified PostgreSQL backup; it preserves accounts, mounts, networks,
Hermes Fedora, Hindsight socialmedia-staticduo and Telegram indexing exclusion.
