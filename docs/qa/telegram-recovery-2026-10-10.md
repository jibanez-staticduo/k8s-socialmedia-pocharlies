# Telegram downloads and WhatsApp response notifications

## Defects and correction

The installed mtcute 0.29.7 download workers request infinite retries. A
provider `upload.getFile` timeout therefore produces a warning every second
instead of returning control to the persistent media recovery queue. Scoped
read clients now propagate -503 immediately and bound other internal retries.
The HTTP media/photo routes return 503 with `Retry-After: 60` for transient
provider failures. Genuine absence remains 404; operation deadlines remain
504. Downloads and the durable recovery queue stay enabled.

The NAS uses UUID message IDs while the WhatsApp poll/event notification
trigger declared a BIGINT variable. Migration 035 uses `messages.id%TYPE`
and scopes all target lookups by provider/account. Notifications use the
target message's conversation and require an exact match. Existing published
migrations are unchanged.

## Validation before deployment

- Telegram tests: 80 passed, including the real mtcute internal-error
  middleware, subsequent successful retry and HTTP status contracts.
- Telegram TypeScript: passed.
- Database migration suite against disposable PostgreSQL 16.15: 13 passed,
  one existing skip. UUID and BIGINT cases cover commit/rollback, withdrawal
  notifications and account/provider isolation.
- Independent review identified an incorrect middleware error fixture; it
  was corrected to the installed library's `mt_rpc_error` and rerun green.

## Related WhatsApp delivery

Commit `a5ffeac` contains inline videos, centered audio controls, poll voters,
history/message recovery, preserved view-once/revoked content, receipts and
presence. Recovery requires content already captured or returned by the
phone. Voters reflect captured votes; last-seen and online state require
provider data and respect its privacy settings. A missing provider value is
not fabricated.

## Deployment acceptance

Publish maintained images to `docker.staticduo.com` and verify their digests.
Run migration 035 through the maintained migrator without restarting the
existing backend. Deploy only the Telegram connector, leaving sync/recovery
enabled. Observe PostgreSQL and Telegram logs for 10-15 minutes, probe actual
media retrieval and confirm continued synchronization before claiming a
production result. A continuing Telegram provider outage must be reported
separately from successful local retry handling.
