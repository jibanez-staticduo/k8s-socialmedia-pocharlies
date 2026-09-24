# WhatsApp browser app

Node 22 HTTP server with PostgreSQL reads, signed manual connector sends and an
isolated Hermes AI adapter. Build this directory as its own Docker context.

Required: APP_AUTH_MODE, APP_PUBLIC_URL (browser HTTPS origin), DATABASE_URL,
SOCIAL_ACCOUNTS_FILE and DATA_DIR (writable by UID 1000). The registry
is an array of enabled WhatsApp accounts with accountId, label, connectorUrl and
secretEnv; each named secret must also exist in the app environment.

Authentication is selected explicitly with `APP_AUTH_MODE=oidc` or
`APP_AUTH_MODE=basic`. OIDC mode requires `OIDC_ISSUER_URL` (the Keycloak apps
realm issuer), `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` and a nonempty,
comma-separated `OIDC_ALLOWED_SUBJECTS` list containing the owner's stable Keycloak
`sub`. `OIDC_SESSION_TTL_SECONDS` defaults to 1800 and may be set between 1 and
604800 seconds. The confidential client must allow only the authorization-code
flow with the exact callback `${APP_PUBLIC_URL}/auth/callback`; PKCE S256 is sent
for every login. OIDC discovery is lazy, so a temporary identity-provider outage
does not make the container fail at startup. Discovery and callback failures fail
closed with an authentication error.

OIDC protects the UI, APIs and media routes with an opaque, bounded in-memory
session. The session cookie is `HttpOnly`, `Secure`, `SameSite=Lax` and scoped to
the host. `GET /auth/login` and `GET /auth/callback` are the only unauthenticated
OIDC routes besides `GET /health`; `POST /auth/logout` requires the configured
Origin and clears the local session. Expired API sessions return a JSON 401 with
`code: AUTH_REQUIRED`, and the browser redirects to the login flow. Basic
credentials (`UI_AUTH_USERNAME` and `UI_AUTH_PASSWORD`) are supported only in
explicit Basic mode for local compatibility and are ignored in OIDC mode.

For Basic mode, set `UI_AUTH_USERNAME` and `UI_AUTH_PASSWORD` as well as
`APP_AUTH_MODE=basic`.

Sending requires APP_ENABLE_SENDING=true and EMERGENCY_DISABLE_SENDING not true,
plus the connector's separate sending gate. Connector responses without a provider
message ID and timeouts return an explicit unconfirmed error; do not retry blindly.
Uploads accept up to 10 MiB of image/video/audio/PDF. Voice recordings are decoded
by ffmpeg and normalized to Ogg Opus, with a ten minute duration limit.

AI requires LITELLM_BASE_URL (including /v1), LITELLM_API_KEY, HERMES_API_URL,
HERMES_API_KEY and HERMES_PROVIDER (default custom; isolated bundled Hermes uses
socialmedia-litellm). Only point Hermes at the isolated read-only instance. The
request contains scoped recent conversation context; tool tenant isolation must
be enforced by the Hermes/MCP deployment, not by prompt instructions. AI sessions
are atomic private JSON files scoped to account, chat and explicit global mode.
Run one app replica per DATA_DIR; locking is within one process.

Media references are resolved only after an account/chat-scoped DB lookup.
HTTP references require exact MEDIA_ALLOWED_ORIGINS (comma separated, no redirects).
S3 references use S3_ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET,
S3_USE_SSL and optional AWS_REGION; corresponding MINIO_* names are supported.
MEDIA_ALLOWED_BUCKETS can allow multiple buckets explicitly. Legacy plain keys use
MINIO_BUCKET. The app signs S3 GETs and never exposes credentials or stored URLs.

Run npm ci and npm test. Tests use a stub database and HTTP upstream; they never
send real WhatsApp messages. GET /health is public and reveals no configuration.
The remaining UI/API routes require the selected authentication mode, and JSON
POST requests must include the exact configured Origin. TLS should terminate at
the proxy.

## NAS verification (2026-09-13)

Published at the configured WHATSAPP_APP_PUBLIC_URL, currently
https://whatsapp.staticduo.com. Access uses the same private UI credentials as the
QR pages. Two accounts, authenticated chat reads, media downloads and the model
catalog were checked through HTTPS. Desktop/mobile Chromium checks cover account
switches, draft isolation, themes, assistant navigation, attachment confirmation
and microphone capture/preview with a simulated device. No real messages were
sent by verification. Eleven backend tests and thirteen generator tests pass.

The bundled agent can search all accounts owned by this app user; the selected
chat and global checkbox determine starting context, not a separate authorization
boundary. Its 18 MCP read tools exclude sends and other mutations. A successful
LiteLLM/Hermes request was verified with an actual social_list_accounts receipt.
Use the assistant answer as a composer draft to review and send manually.

Current limits: the latest 200 stored messages per chat are displayed; history
availability depends on provider synchronization. Uploads are limited to 10 MiB.
Calling/video calls, automatic voice transcription and AI-triggered sends are not
implemented. Browser codec support determines which media can play inline;
originals remain downloadable. The app does not cache conversations offline.
