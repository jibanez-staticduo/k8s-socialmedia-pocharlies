# Hermes on Fedora: current WhatsApp chat MCP

Hermes connects to the SocialMedia MCP over the existing HTTPS endpoint. Its
server entry exposes only the current-chat read and proposal tools; approval and
delivery remain in the authenticated SocialMedia web app.

Add this entry under `mcp_servers` in the Fedora Hermes `~/.hermes/config.yaml`:

```yaml
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

Store `SOCIALMEDIA_MCP_TOKEN` in Fedora's `~/.hermes/.env` with mode `0600`.
It is the existing `MCP_SSE_AUTH_TOKEN` for the SocialMedia deployment; never
put its value in this repository or in `config.yaml`. Keep `config.yaml` mode
`0600` too. The web app issues a signed capability for one owner-selected
account, chat and turn. Hermes sees only that capability and cannot choose a
different destination. `social_send_current_chat` creates a pending proposal;
it does not send a WhatsApp message.

Check the connection with `hermes mcp test socialmedia_current_chat` and the
effective filter with `hermes mcp list` (expect `2 selected`). The diagnostic
test enumerates the server's full catalog before applying the Hermes filter.
Restart a running Hermes process or use `/reload-mcp` in an interactive session
after changing its configuration.
