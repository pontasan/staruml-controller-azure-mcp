#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createAzureServer } from "./server.js"

async function main(): Promise<void> {
    const server = createAzureServer()
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("StarUML Controller MCP server (azure) started on stdio")

    const shutdown = async () => {
        await server.close()
        process.exit(0)
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
}

main().catch((err) => {
    console.error("Failed to start MCP server:", err)
    process.exit(1)
})
