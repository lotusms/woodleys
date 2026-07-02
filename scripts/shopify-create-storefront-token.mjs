#!/usr/bin/env node
/**
 * Creates a Shopify Storefront API access token using Dev Dashboard app credentials.
 *
 * Requires in .env.local:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_CLIENT_ID
 *   SHOPIFY_CLIENT_SECRET
 *
 * Usage: pnpm shopify:storefront-token
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(ENV_PATH);

const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
const tokenTitle =
  process.env.SHOPIFY_STOREFRONT_TOKEN_TITLE?.trim() || "Woodleys Next.js";

function fail(message) {
  console.error(`\nError: ${message}\n`);
  console.error("See docs/SHOPIFY_DEV_SETUP.md for setup steps.\n");
  process.exit(1);
}

if (!domain) fail("Missing SHOPIFY_STORE_DOMAIN in .env.local");
if (!clientId) fail("Missing SHOPIFY_CLIENT_ID in .env.local");
if (!clientSecret) fail("Missing SHOPIFY_CLIENT_SECRET in .env.local");

const shop = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

async function getAdminAccessToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    fail(
      `Admin token request failed (${res.status}): ${data.error_description || data.error || res.statusText}`,
    );
  }

  if (!data.access_token) {
    fail("Admin token response did not include access_token");
  }

  return { token: data.access_token, scope: data.scope || "" };
}

async function fetchGrantedScopes(adminToken) {
  const query = `
    {
      currentAppInstallation {
        accessScopes { handle }
      }
    }
  `;

  const res = await fetch(`https://${shop}/admin/api/2026-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query }),
  });

  const payload = await res.json().catch(() => ({}));
  const scopes =
    payload.data?.currentAppInstallation?.accessScopes?.map((s) => s.handle) ||
    [];

  return scopes;
}

async function createStorefrontToken(adminToken) {
  const mutation = `
    mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        storefrontAccessToken {
          accessToken
          title
          accessScopes { handle }
        }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch(`https://${shop}/admin/api/2026-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input: { title: tokenTitle } },
    }),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    fail(`Storefront token mutation failed (${res.status}): ${JSON.stringify(payload)}`);
  }

  const result = payload.data?.storefrontAccessTokenCreate;
  const errors = result?.userErrors || [];

  if (errors.length) {
    fail(
      errors.map((e) => e.message).join("; ") +
        " — enable Storefront API scopes on your app version, release, and reinstall.",
    );
  }

  const token = result?.storefrontAccessToken?.accessToken;
  if (!token) {
    const graphqlErrors = payload.errors?.map((e) => e.message).join("; ");
    const err = new Error(graphqlErrors || "storefrontAccessTokenCreate returned null");
    err.grantedScopes = [];
    throw err;
  }

  return {
    token,
    scopes: result.storefrontAccessToken.accessScopes?.map((s) => s.handle) || [],
  };
}

console.log(`\nShop: ${shop}`);
console.log("Requesting admin access token…");

const { token: adminToken, scope: oauthScope } = await getAdminAccessToken();
if (oauthScope) {
  console.log(`Admin token scopes: ${oauthScope}`);
}

const grantedScopes = await fetchGrantedScopes(adminToken);
if (grantedScopes.length) {
  console.log(`Installed app scopes: ${grantedScopes.join(", ")}`);
}

const hasUnauthenticated = grantedScopes.some((s) =>
  s.startsWith("unauthenticated_"),
);

if (!hasUnauthenticated) {
  console.warn(
    "\nWarning: no unauthenticated_* scopes on this install. storefrontAccessTokenCreate will fail until you add Storefront API scopes, release a new version, and reinstall.\n",
  );
}

console.log("Creating Storefront API access token…");

try {
  const { token, scopes } = await createStorefrontToken(adminToken);

  console.log("\nSuccess. Add this to .env.local:\n");
  console.log(`SHOPIFY_STOREFRONT_ACCESS_TOKEN=${token}`);
  if (scopes.length) {
    console.log(`\nScopes: ${scopes.join(", ")}`);
  }
  console.log("\nRestart pnpm dev after updating .env.local.\n");
} catch (error) {
  console.error(`\nError: ${error.message}\n`);
  if (grantedScopes.length) {
    console.error(`Current install scopes: ${grantedScopes.join(", ")}\n`);
  }
  console.error(
    "Fix on dev.shopify.com → Lotus Jewelry app:\n" +
      "  1. Settings → enable Storefront API (if toggle exists)\n" +
      "  2. Versions → Create version → add these in Access scopes:\n" +
      "     read_products, unauthenticated_read_product_listings,\n" +
      "     unauthenticated_read_product_inventory, unauthenticated_write_checkouts,\n" +
      "     unauthenticated_read_checkouts\n" +
      "  3. Release → Home → Install app again on Lotus Jewelery\n" +
      "  4. Re-run: pnpm shopify:storefront-token\n",
  );
  console.error("See docs/SHOPIFY_DEV_SETUP.md\n");
  process.exit(1);
}
