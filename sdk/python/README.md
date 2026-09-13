# veltro

Official Python SDK for the [Veltro](https://veltro.com) API — real-time payment corridor and anchor analytics for the Stellar network.

## Install

```bash
pip install veltro
```

## Usage

```python
import asyncio
from veltro import Veltro

async def main():
    async with Veltro(api_key="sk_...") as client:
        anchors = await client.anchors.list()
        corridor = await client.corridors.get("USDC:issuer", "native")
        price = await client.prices.get("XLM:native")

asyncio.run(main())
```

Point at testnet or a local backend with `base_url`:

```python
client = Veltro(api_key="sk_...", base_url="http://localhost:8080")
```

## Resources

`anchors`, `corridors`, `prices`, `cost_calculator`, `alerts`, `webhooks`,
`api_keys`, `auth`, `liquidity_pools`, `transactions`, `network`, `ml`,
`governance`, `asset_verification` — see `veltro/resources.py` for
the full method list on each.

## Development

```bash
pip install -e ".[dev]"
pytest                        # unit tests
pytest -m testnet             # integration tests against a real backend (needs credentials)
```
