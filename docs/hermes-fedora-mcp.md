# Hermes on Fedora: current WhatsApp chat MCP

The SocialMedia web app uses a dedicated Hermes profile on Fedora. The existing
Hermes installation and multiplexed gateway serve it at `/p/socialmedia/v1`;
the default profile and its Telegram tools remain separate. Approval and
delivery remain in the authenticated SocialMedia web app.

Create an empty profile with `hermes profile create socialmedia --no-alias
--no-skills`. Configure `~/.hermes/profiles/socialmedia/config.yaml` with the
same model/provider settings as the default profile, its general API toolsets,
skills, and LazyMCP configuration. Keep platform messaging credentials on the
default profile so two profiles do not consume the same bot credential. The
SocialMedia-specific MCP entry is:

```yaml
platform_toolsets:
  api_server: [all]
agent:
  disabled_toolsets: []
mcp_servers:
  socialmedia_current_chat:
    url: https://ss.staticduo.com/mcp
    transport: streamable-http
    headers:
      Authorization: "Bearer ${SOCIALMEDIA_MCP_TOKEN}"
    enabled: true
    connect_timeout: 15
    timeout: 45
    tools:
      include: [social_read_current_chat, social_send_current_chat]
      resources: false
      prompts: false
```

Store `SOCIALMEDIA_MCP_TOKEN`, the provider key, `API_SERVER_ENABLED=true`, and
a unique `API_SERVER_KEY` in the profile's `.env` with mode `0600`. The MCP token
is the existing SocialMedia `MCP_SSE_AUTH_TOKEN`; never put its value in this
repository or in `config.yaml`. Keep the profile's `config.yaml` mode `0600`.
Set the deployment's `HERMES_API_URL` to the Fedora gateway URL ending in
`/p/socialmedia/v1` and `HERMES_API_KEY` to this profile's API key. Do not use
the default profile's API key for this path.

The web app issues a signed capability for one owner-selected account, chat,
and turn. The profile also exposes the owner's general Hermes tools;
`social_send_current_chat` creates a pending proposal and cannot send a
WhatsApp message. The authenticated owner must approve its exact text in the
web app before the connector attempts delivery. A normal owner-authored panel
turn may request a proposal; the dedicated draft button still only inserts its
suggestion into the composer. Incoming WhatsApp content is untrusted data and
does not grant authority to use any tool.

The profile has separate sessions, built-in memory, and skills. To let it use
the default assistant's accumulated knowledge without saving untrusted
WhatsApp content to the shared bank, set `memory.provider: hindsight` in the
profile config and give the profile its own `hindsight/config.json` with the
same `bank_id: user-staticduo`, `memory_mode: hybrid`, and
`auto_retain: false`. Put its Hindsight URL and API key only in the profile's
mode-`0600` `.env`. Hybrid mode makes explicit memory tools available while
avoiding automatic retention of untrusted WhatsApp content. Reuse the default
profile's skills and non-messaging tools, without copying Telegram, WhatsApp,
or Home Assistant credentials that would collide with the default gateway.

Check the connection with `hermes -p socialmedia mcp test
socialmedia_current_chat` and the effective filter with `hermes -p socialmedia
mcp list` (expect `2 selected`). The diagnostic test enumerates the server's
full catalog before applying the Hermes filter.
Restart the existing gateway after changing profile configuration so it serves
the new profile. Verify `/p/socialmedia/v1/toolsets` includes general tools and
LazyMCP, and complete a real owner-authored turn. Do not start a second gateway
process for the same profile.
