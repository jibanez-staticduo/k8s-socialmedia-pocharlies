# Connector recovery - 2026-10-30

Telegram history now records committed pages in `telegram_history_state`, keyed
by account and chat. The in-progress exclusive offset and pinned upper ID are
separate from complete coverage and realtime progress. Existing global legacy
state is retained, but cannot establish coverage: its owner and successful
insertion of every message were not provable. The first scan conservatively
reconciles history; subsequent scans resume their committed page after errors or
restart. Inserts remain idempotent. Insert failures do not advance a checkpoint.

429/503 page retries preserve the exact offset and honor Retry-After with
additive jitter and a finite budget. Shared connector GET requests are paced and
retain the existing account cooldown. Telegram remains excluded from Hindsight.
The local additive table is initialized by the sync worker; published migrations
are unchanged. There is no re-embedding or rerun of migration 034.

The pinned Baileys rc13 patch accepts observed raw JIDs and serialized participant
objects for number-change notifications. It retains participant order and author
identity, rejects invalid shapes without fabricated IDs, and preserves existing
privacy-token patch sections. Connector notification metadata retains author and
authorPn so a one-participant change keeps both old and new identities.

Authenticated POST `/api/v1/history/recover` accepts optional `messageIds` (1-10
explicit distinct IDs). This mode scopes unavailable messages to account/chat,
excludes edited/deleted/hidden rows, restores an existing captured payload or
requests a placeholder resend. It never requests generic history or changes auth.
Provider acknowledgements and DB-confirmed recovery have separate outcomes.

Validation uses synthetic IDs and an isolated PostgreSQL 16 database, never
production chats as test fixtures. It covers Telegram 200-429-200, restart,
partial insert failure, UUID/BIGINT, account isolation, and checkpoint replay.
WhatsApp tests exercise the actual installed patched processor, targeted HMAC
route, and PostgreSQL placeholder replacement with stable UUID, replay without
extra rows/attachments, and preserved edits/deletion flags.

Production rollout evidence and provider-dependent recovery outcomes are
reported separately. A resend request is not proof that the phone returned
content. The historical `total_imported` diagnostic can undercount inserts
committed immediately before a failed checkpoint; coverage remains conservative.
