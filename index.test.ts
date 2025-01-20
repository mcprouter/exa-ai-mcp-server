import { beforeAll, expect, test } from "bun:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

const transport = new StdioClientTransport({
  command: "./index.ts",
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
}, {
  capabilities: {}
});

beforeAll(async () => {
  await client.connect(transport);
})

test("List tools should work", async () => {
  const toolResponse = await client.request(
    { method: "tools/list" },
    ListToolsResultSchema
  );

  expect(toolResponse.tools.length).toBe(1);
});

