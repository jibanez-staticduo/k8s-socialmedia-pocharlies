# Hermes on Fedora: current WhatsApp chat MCP

The SocialMedia web app uses a dedicated Hermes profile on Fedora. The existing
Hermes installation and multiplexed gateway serve it at `/p/socialmedia/v1`;
the default profile and its Telegram tools remain separate. Approval and
delivery remain in the authenticated SocialMedia web app.

Create an empty profile with `hermes profile create socialmedia --no-alias
--no-skills`. Configure `~/.hermes/profiles/socialmedia/config.yaml` with the
same model/provider settings as the default profile and this restricted API
toolset and MCP entry:

```yaml
platform_toolsets:
  api_server: [socialmedia_current_chat]
agent:
  disabled_toolsets: [terminal, code_execution, file, browser, delegation, connections, cronjob, messaging, homeassistant]
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
and turn. The restricted profile exposes only the current-chat MCP tools;
`social_send_current_chat` creates a pending proposal and cannot send a
WhatsApp message. The authenticated owner must approve its exact text in the
web app before the connector attempts delivery.

The profile has separate sessions, built-in memory, and skills. To let it use
the default assistant's accumulated knowledge without saving untrusted
WhatsApp content to the shared bank, set `memory.provider: hindsight` in the
profile config and give the profile its own `hindsight/config.json` with the
same `bank_id: user-staticduo`, `memory_mode: context`, `auto_recall: true`, and
`auto_retain: false`. Put its Hindsight URL and API key only in the profile's
mode-`0600` `.env`. Context mode injects relevant recall without exposing
Hindsight write tools; it does not share live session history or skills. The
credential itself is not read-only, so keep terminal, code execution, file,
and other global toolsets disabled for this profile. Do not copy the default
profile's skills or messaging channels into it.

Check the connection with `hermes -p socialmedia mcp test
socialmedia_current_chat` and the effective filter with `hermes -p socialmedia
mcp list` (expect `2 selected`). The diagnostic test enumerates the server's
full catalog before applying the Hermes filter. Verify the profile's
`/p/socialmedia/v1/toolsets` and a completed chat turn; neither `terminal`,
`execute_code`, nor the default profile's LazyMCP tools may be available.
Restart the existing gateway after changing profile configuration so it serves
the new profile. Do not start a second gateway process for the same profile.
