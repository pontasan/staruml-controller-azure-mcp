import { createServer, azureTools } from "staruml-controller-mcp-core"

export function createAzureServer() {
    return createServer("staruml-controller-azure", "1.0.0", azureTools)
}
