import { beforeAll, expect, test } from "bun:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  StdioClientTransport,
  getDefaultEnvironment,
} from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  CallToolResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

const transport = new StdioClientTransport({
  command: "bun",
  args: ["run", "src/index.ts"],
  env: {
    ...getDefaultEnvironment(),
    EXA_API_KEY: process.env.EXA_API_KEY ?? "",
  },
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  },
);

beforeAll(async () => {
  await client.connect(transport);
});

test("List tools should work", async () => {
  const toolResponse = await client.request(
    { method: "tools/list" },
    ListToolsResultSchema,
  );

  expect(toolResponse.tools.length).toBe(1);
});

test("Call search tool should work", async () => {
  const toolResponse = await client.request(
    {
      method: "tools/call",
      params: {
        name: "search",
        arguments: { query: "buffalo bills quarterback 2024" },
      },
    },
    CallToolResultSchema,
  );

  expect(toolResponse.content[0].text).toContain("Josh Allen");
});
