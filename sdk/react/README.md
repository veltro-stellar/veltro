# @veltro/react

React hooks and components for [Veltro](https://github.com/Ndifreke000/veltro), built on top of [`@veltro/sdk`](../typescript).

## Install

```bash
npm install @veltro/react @veltro/sdk
```

## Quickstart

```tsx
import { VeltroProvider, CorridorReliabilityCard } from "@veltro/react";

export function App() {
  return (
    <VeltroProvider network="mainnet">
      <CorridorReliabilityCard source="USDC" destination="BRL" />
    </VeltroProvider>
  );
}
```

`VeltroProvider` also accepts a pre-built client (useful if your
app already constructs one, e.g. with a custom `baseUrl` or auth token):

```tsx
import { Veltro } from "@veltro/sdk";
import { VeltroProvider } from "@veltro/react";

const client = new Veltro({ baseUrl: "https://your-backend.example.com" });

<VeltroProvider client={client}>...</VeltroProvider>;
```

## Hooks

```tsx
import { useCorridor, useCorridors } from "@veltro/react";

function CorridorList() {
  const { data, isLoading, error } = useCorridors();
  // ...
}

function CorridorDetail() {
  const { data, isLoading, error, refetch } = useCorridor("USDC", "BRL");
  // ...
}
```

Both hooks return `{ data, error, isLoading, refetch }` and must be called
under a `<VeltroProvider>`.

## Components

- **`CorridorReliabilityCard`** — success rate, latency, and volume for a
  single corridor. Ships with minimal inline default styling (no CSS or
  Tailwind dependency) so it drops into any host app; pass `className` to
  restyle it with your own design system.

More components/hooks (trust scores, network health, liquidity pools) can
follow the same pattern — see `src/hooks/useCorridor.ts` for the shape to
copy.

## License

MIT
