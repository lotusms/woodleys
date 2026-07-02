# Shopify setup via Dev Dashboard (dev.shopify.com)

Use this path when the **Headless** sales channel is blocked on your plan. A custom app on [dev.shopify.com](https://dev.shopify.com) can issue a **Storefront API** token for the Next.js site.

## Overview

| Variable | Where it lives | Purpose |
|----------|----------------|---------|
| `SHOPIFY_STORE_DOMAIN` | `.env.local` + Vercel | `lotus-jewelery.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `.env.local` + Vercel | Public token for catalog + cart in Next.js |
| `SHOPIFY_CLIENT_ID` | `.env.local` only | Dev app credentials (scripts, server only) |
| `SHOPIFY_CLIENT_SECRET` | `.env.local` only | Dev app secret (never commit, never expose to browser) |

The storefront token is what the website uses. Client ID and secret are only for generating or rotating that token locally.

---

## Step 1: Create the app

1. Open [dev.shopify.com/dashboard](https://dev.shopify.com/dashboard).
2. **Apps** → **Create app** → **Start from Dev Dashboard**.
3. Name it e.g. `Woodleys Next.js Storefront`.
4. Click **Create**.

---

## Step 2: Create and release a version

1. Open your app → **Versions** tab → **Create version**.
2. **App URL:** `https://shopify.dev/apps/default-app-home` (fine for a non-embedded API app).
3. **Webhooks API version:** latest stable (e.g. `2026-04`).
4. **Access scopes** (one combined list in the version form). Include **both** Admin and Storefront scopes:

   ```
   read_products,unauthenticated_read_product_listings,unauthenticated_read_product_inventory,unauthenticated_write_checkouts,unauthenticated_read_checkouts
   ```

   The `unauthenticated_*` scopes are required. Without them, `pnpm shopify:storefront-token` returns `ACCESS_DENIED`.

5. **Settings** tab (same app): if you see **Storefront API** or **Enable Storefront API**, turn it on.

6. Click **Release**.

---

## Step 3: Install on your store

1. App **Home** → scroll to **Install app**.
2. Choose **Lotus Jewelery** (`lotus-jewelery.myshopify.com`) or your production store.
3. Click **Install** and approve scopes.

The app and store must belong to the same Partner organization for the client-credentials flow.

---

## Step 4: Copy API credentials

1. App → **Settings**.
2. Copy **Client ID** and **Client secret**.
3. Add to `.env.local` (do not commit):

   ```env
   SHOPIFY_STORE_DOMAIN=lotus-jewelery.myshopify.com
   SHOPIFY_CLIENT_ID=your_client_id
   SHOPIFY_CLIENT_SECRET=shpss_xxxxxxxx
   ```

---

## Step 5: Generate the Storefront token

From the project root:

```bash
pnpm shopify:storefront-token
```

The script prints a `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Paste it into `.env.local`, then restart the dev server:

```bash
pnpm dev
```

Re-run the script if you rotate credentials or need a new token (max 100 active tokens per shop).

---

## Step 6: Publish products to the app

In Shopify Admin:

1. **Products** → your product.
2. **Sales channels and apps** → enable your custom app (and **Online Store** if needed).
3. Status **Active** → **Save**.

---

## Step 7: Vercel (production)

In the Vercel project, add:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

Do **not** add `SHOPIFY_CLIENT_SECRET` to Vercel unless you plan to rotate tokens on the server. The storefront token alone is enough for the live site.

Redeploy after saving variables.

---

## Verify

Visit `/shop-all` on localhost. When integration is wired, products from Shopify appear in the catalog. Until then, checkout at `/checkout` redirects to Shopify cart when `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is set.

Test the token in Admin → your app may expose GraphiQL, or run:

```bash
curl -s -X POST \
  "https://lotus-jewelery.myshopify.com/api/2026-04/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query":"{ products(first:3){ nodes { title handle } } }"}'
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ACCESS_DENIED` on `storefrontAccessTokenCreate` | Add `unauthenticated_*` scopes to the app **version** (not optional scopes). **Release**, then **reinstall** the app on the store. Enable Storefront API under app **Settings** if shown. |
| `invalid_client` on token script | App not installed on that store, or wrong client ID/secret |
| Script warns "no unauthenticated_* scopes" | Reinstall after releasing a new version with the scopes above |
| Headless channel still blocked | Expected on trial/Starter. Dev Dashboard path does not need Headless |
| Empty products in API | Product not published to the custom app sales channel |

## References

- [Create apps using the Dev Dashboard](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)
- [Client credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant)
- [storefrontAccessTokenCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/storefrontAccessTokenCreate)
