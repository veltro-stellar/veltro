import { Veltro, NETWORKS } from "@veltro/sdk";
import type { VeltroClient } from "./sdk-types.js";

/**
 * One client per server process, matching how every other SDK consumer
 * authenticates. VELTRO_BASE_URL overrides the network default,
 * for pointing at a local/dev backend.
 */
export function createClientFromEnv(): VeltroClient {
  const apiKey = process.env.VELTRO_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VELTRO_API_KEY is required. Set it to a Veltro API key " +
        "(see /api/api-keys) before starting the MCP server.",
    );
  }

  const network = process.env.VELTRO_NETWORK === "mainnet" ? "mainnet" : "testnet";
  const baseUrl = process.env.VELTRO_BASE_URL ?? NETWORKS[network].apiBaseUrl;

  return new Veltro({ apiKey, baseUrl });
}

export const ALLOW_WRITES = process.env.VELTRO_MCP_ALLOW_WRITES === "true";
