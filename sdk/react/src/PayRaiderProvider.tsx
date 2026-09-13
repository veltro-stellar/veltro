import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Veltro, createClient, type VeltroConfig } from "@veltro/sdk";

const VeltroContext = createContext<Veltro | null>(null);

export interface VeltroProviderProps {
  children: ReactNode;
  /** Use an already-constructed client — takes precedence over `network`/`config`. */
  client?: Veltro;
  /** Convenience path: build a client for "mainnet" or "testnet". */
  network?: "mainnet" | "testnet";
  config?: Omit<VeltroConfig, "baseUrl">;
}

/**
 * Wrap your app (or the part of it that renders Veltro data) in
 * this provider so `use*` hooks and components from this package can find a
 * client. Pass either a pre-built `client`, or `network` (+ optional
 * `config`) and one will be created for you.
 */
export function VeltroProvider({
  children,
  client,
  network = "mainnet",
  config,
}: VeltroProviderProps) {
  const resolvedClient = useMemo(
    () => client ?? createClient(network, config),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- config is expected to be stable/memoized by the caller
    [client, network],
  );

  return (
    <VeltroContext.Provider value={resolvedClient}>
      {children}
    </VeltroContext.Provider>
  );
}

export function useVeltroClient(): Veltro {
  const client = useContext(VeltroContext);
  if (!client) {
    throw new Error(
      "useVeltroClient must be used within a <VeltroProvider>",
    );
  }
  return client;
}
