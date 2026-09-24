# Dedicated WhatsApp Hermes runtime

Build this directory as the Docker context. The image downloads Hermes commit
`073c57872a4616ac7567d76b1e51429f96dba53f` from NousResearch/hermes-agent.
It installs core dependencies, the MCP extra, and aiohttp; messaging platform,
browser, GPU, and all-tools extras are excluded. Build requires GitHub and PyPI
access. Alpine may compile dependencies using the builder's C/Rust toolchains.

Run as UID:GID `1000:1000`. Mount a dedicated writable state directory at
`/data/hermes`, or set `HERMES_HOME=/data` and mount `/data`. Do not mount another
Hermes installation, home directory, Docker socket, or host filesystem.

Required environment:

| Variable | Meaning |
| --- | --- |
| `LITELLM_BASE_URL` | OpenAI-compatible LiteLLM URL, including `/v1` |
| `LITELLM_API_KEY` | LiteLLM credential |
| `HERMES_API_KEY` | Dedicated API credential, at least 16 characters |
| `MCP_URL` | Internal socialmedia endpoint, e.g. `http://mcp-sse:3010/mcp` |
| `MCP_TOKEN` | socialmedia MCP bearer credential |
| `HERMES_PROVIDER` | Named LiteLLM custom provider for this runtime |
| `HERMES_DEFAULT_MODEL` | Model used for web chat turns |

The app uses `HERMES_DEFAULT_MODEL` for every web chat turn. The default
advertised alias is `hermes-agent`.

Startup writes only this instance's config, enables the API through
`API_SERVER_KEY`, and executes `hermes gateway run`. Hermes does not require an
`API_SERVER_ENABLED` variable. Listen address is `0.0.0.0:8642`; expose it only
on the Compose network, without a host port. Health endpoint: `GET /health`.
Authenticated discovery: `GET /v1/capabilities`, `/v1/toolsets`, `/v1/models`.

The API platform enables only the `socialmedia` MCP server. Every built-in
toolset is suppressed, and startup refuses an effective toolset other than
`socialmedia`. The MCP allowlist contains only `social_read_current_chat` and
`social_send_current_chat`. Both require a short-lived capability signed by
`HERMES_CHAT_TOOL_SECRET` and scoped to one account and conversation. The send
tool only creates a proposal and requires a per-turn `propose` grant from the
authenticated web owner and `HERMES_CHAT_ALLOW_PROPOSALS=true` on the app and
MCP server. Delivery requires separate web approval and the app sending gate.
The MCP `ENABLE_SENDING` gate can stay false. MCP sampling is disabled. Credentials
remain server-side and must never reach the browser.

The pinned source previously resolved the effective toolset to `{socialmedia}`.
After deployment, verify that MCP discovery admits the two scoped tools and
rejects `social_send_message`, `social_create_draft`, `social_list_messages`,
and `terminal`. A warning about the initially unknown `socialmedia` toolset
can appear before MCP registers its dynamic tools. Image build and
authenticated session checks are deployment acceptance steps.
