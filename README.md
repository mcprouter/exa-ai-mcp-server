# Exa.ai MCP Server

An implementation of the [Model Context Protocol (MCP)](https://modelcontextprotocol.com/) server that provides access to [Exa.ai](https://exa.ai) search capabilities.

## Overview

This server enables AI agents to perform web searches using Exa.ai's API through the standardized Model Context Protocol. It exposes a `search` tool that can be used by any MCP-compatible client.

## Prerequisites

1. Install [Bun](https://bun.sh):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Set up your Exa API key:
   ```bash
   export EXA_API_KEY=your_api_key_here
   ```
   You can add this to your shell profile (.bashrc, .zshrc, etc.) to make it persistent.
   
   > Get your API key by signing up at [Exa.ai](https://exa.ai)

## Getting Started

To install dependencies:

```bash
bun install
```

To run the server in development mode:

```bash
bun dev
```

To inspect the MCP protocol interactions:

```bash
bun inspect
```

## Related Links

- [Model Context Protocol](https://modelcontextprotocol.com)
- [Exa.ai Documentation](https://exa.ai/docs)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)

## License

This project is licensed under [MIT License](LICENSE).

---
This project was created using the MCP Server template with Bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.