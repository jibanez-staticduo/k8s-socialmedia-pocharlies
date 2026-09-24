"""Render the dedicated NAS runtime configuration without logging credentials."""

import os
from pathlib import Path
from urllib.parse import urlparse

import yaml


def required(name):
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Required environment variable is missing: {name}")
    return value


def endpoint(name):
    value = required(name)
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise SystemExit(f"Invalid HTTP endpoint: {name}")
    return value


def main():
    key = required("HERMES_API_KEY")
    if len(key) < 16:
        raise SystemExit("HERMES_API_KEY must contain at least 16 characters")
    required("LITELLM_API_KEY")
    mcp_token = required("MCP_TOKEN")
    config = yaml.safe_load(Path("/runtime/config.template.yaml").read_text())
    base_url = endpoint("LITELLM_BASE_URL")
    config["model"]["base_url"] = base_url
    config["model"]["default"] = required("HERMES_DEFAULT_MODEL")
    provider = required("HERMES_PROVIDER")
    config["model"]["provider"] = provider
    config["custom_providers"][0]["name"] = provider
    config["custom_providers"][0]["base_url"] = base_url
    config["mcp_servers"]["socialmedia"]["url"] = endpoint("MCP_URL")
    config["mcp_servers"]["socialmedia"]["headers"] = {"Authorization": f"Bearer {mcp_token}"}

    # Suppress every built-in toolset, including future defaults in the pinned runtime.
    from toolsets import TOOLSETS
    from hermes_cli.tools_config import _get_platform_tools

    config["agent"]["disabled_toolsets"] = sorted(TOOLSETS)
    resolved = _get_platform_tools(config, "api_server")
    if resolved != {"socialmedia"}:
        raise SystemExit("Refusing startup: effective tools exceed the socialmedia MCP scope")

    home = Path(os.environ["HERMES_HOME"])
    home.mkdir(parents=True, exist_ok=True)
    os.umask(0o077)
    config_path = home / "config.yaml"
    config_path.write_text(yaml.safe_dump(config, sort_keys=False))
    config_path.chmod(0o600)
    os.environ.update(API_SERVER_KEY=key, API_SERVER_HOST="0.0.0.0", API_SERVER_PORT="8642",
                      API_SERVER_MODEL_NAME="hermes-agent")
    os.execvp("hermes", ["hermes", "gateway", "run"])


if __name__ == "__main__":
    main()
