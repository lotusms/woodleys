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

- `NEXT_PUBLIC_FIREBASE_*` — client auth (email, Google sign-in)
- `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for Shopify catalog/checkout ([setup guide](docs/SHOPIFY_DEV_SETUP.md))

## Authentication & roles

- **Sign in / register:** header **Account** menu, `/login`, `/register` (email + Google)
- **Members:** `/account` — orders and profile inside the main site layout
- **Admins:** `/dashboard` — operations app; opens in a **new tab** after sign-in

Admin access is assigned **only in Firestore** (`useraccounts.admin = true`). See [docs/ADMIN_ACCESS.md](docs/ADMIN_ACCESS.md).

```bash
pnpm set:admin lotusms@outlook.com
```

## Project structure

- `src/config/` — brand, navigation, metadata
- `src/lib/catalog/` — category taxonomy (Shopify-ready handles)
- `src/lib/shopify/` — Shopify integration stubs
- `src/app/(main)/` — public marketing and catalog pages
