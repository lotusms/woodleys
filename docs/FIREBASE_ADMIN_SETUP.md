# Firebase Admin setup (dashboard product API)

The dashboard saves products through `/api/admin/products`, which uses the **Firebase Admin SDK** on the server. That requires a service account key in `.env.local`.

## Quick setup (local)

1. Open [Firebase Console → Service accounts](https://console.firebase.google.com/project/woodleys-3c319/settings/serviceaccounts/adminsdk) for project **woodleys-3c319**.

2. Click **Generate new private key** and save the JSON file (e.g. to Downloads).

3. From the project root:

```bash
pnpm setup:firebase-admin ~/Downloads/woodleys-3c319-firebase-adminsdk-xxxxx.json
```

4. Restart the dev server (`pnpm dev`).

5. Verify:

```bash
pnpm verify:firebase-admin
```

You should see `Firebase Admin OK.`

## What gets configured

- Key copied to `.secrets/firebase-service-account.json` (gitignored)
- `.env.local` updated with `GOOGLE_APPLICATION_CREDENTIALS=...`

## Vercel / production

Add an environment variable in Vercel:

- **Name:** `FIREBASE_SERVICE_ACCOUNT_JSON`
- **Value:** entire service account JSON on one line (minified)

Do not commit the JSON file to git.

## Local fallback

If Admin is not configured, signed-in shop administrators can still create products via the browser Firestore SDK (same security rules). Storefront cache revalidation works only when the Admin API succeeds.

## Wrong key in `firebase/`

The file `firebase/shamrockartstudio-firebase-adminsdk-*.json` is for a **different** project. Use a key for **woodleys-3c319** only.
