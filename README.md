# Woodley's Jewelers

Luxury editorial website for Woodley's Jewelers — a family-owned fine jeweler in Beaumont, California since 1948.

## Stack

- Next.js 16 (App Router)
- JavaScript
- Tailwind CSS 4
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

Opens at [http://localhost:3002](http://localhost:3002).

## Environment

Copy `.env.example` to `.env.local` and configure:

- `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for Shopify catalog/checkout
- `NEXT_PUBLIC_STULLER_EMBED_URL` for the Stuller catalog on Shop All

## Project structure

- `src/config/` — brand, navigation, metadata
- `src/lib/catalog/` — category taxonomy (Shopify-ready handles)
- `src/lib/shopify/` — Shopify integration stubs
- `src/app/(main)/` — public marketing and catalog pages
