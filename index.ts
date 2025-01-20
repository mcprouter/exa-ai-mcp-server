#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import type { Tool } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "@mcprouter/exa-ai-mcp-server",
    version: "1.0.11",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const SEARCH_TOOL: Tool = {
  name: "search",
  description: "Search on exa.ai",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The query to send to Exa.ai to search the web for",
      },
    },
    required: ["query"],
  },
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [SEARCH_TOOL],
}));

async function search(query: string) {
  const api_key = process.env.EXA_API_KEY;

  if (!api_key) {
    throw new Error("EXA_API_KEY is required");
  }

  const options = {
    method: "POST",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  const response = await fetch("https://api.exa.ai/search", options);

  const text = await response.text();

  return [
    {
      type: "text",
      text,
    },
  ];
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search") {
    const input = request.params.arguments as { query: string };
    return { content: await search(input.query) };
  }

  throw new McpError(
    ErrorCode.MethodNotFound,
    `Unknown tool: ${request.params.name}`,
  );
});

server.onerror = (error: any) => {
  console.error(error);
};

process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Starter Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
