#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "@mcprouter/exa-ai-mcp-server",
  version: "1.0.23",
});

// Define the search tool with Zod schema
server.tool(
  "search",
  {
    query: z.string(),
    fullText: z.boolean().optional().default(true),
  },
  async ({ query, fullText }) => {
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
      body: JSON.stringify({ query, text: fullText }),
    };

    const response = await fetch("https://api.exa.ai/search", options);
    const text = await response.text();

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  },
);

// Handle shutdown
process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

// Start the server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Starter Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
