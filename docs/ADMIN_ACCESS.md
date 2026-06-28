# Admin access (manual only)

Woodley's Jewelers has two auth roles stored in Firestore:

| Role | Firestore | Access |
|------|-----------|--------|
| **Member** (default) | `admin: false`, `guest: false` | `/account` — main site UI with orders and profile |
| **Admin** | `admin: true`, `guest: false` | `/dashboard` — separate operations app (opens in a new tab) |

There is **no in-app control** to grant admin access. Firestore security rules block clients from changing the `admin` field.

## Collection

- **Database:** `main` (see `NEXT_PUBLIC_FIRESTORE_DATABASE_ID`)
- **Collection:** `useraccounts`
- **Document id:** Firebase Auth `uid`

## Option 1 — Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/) → project **woodleys-3c319**
2. **Firestore Database** → database **main** → collection **`useraccounts`**
3. Find the document whose `email` matches the user (or use the Auth uid as document id)
4. Set **`admin`** to `true` (boolean)
5. Ensure **`guest`** is `false` or absent

## Option 2 — CLI script (recommended)

After `firebase login` on your machine:

```bash
pnpm seed:admin lotusms@outlook.com
```

Uses the same credentials as `firebase deploy`. Creates or updates `useraccounts/{uid}` with `admin: true`.

Alternative (requires service account in `.env.local`):

```bash
pnpm set:admin lotusms@outlook.com
```

Revoke admin:

```bash
pnpm set:admin --revoke lotusms@outlook.com
```

Requires `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON`.

## Your admin user

After creating `lotusms@outlook.com` in Firebase Authentication, run:

```bash
pnpm set:admin lotusms@outlook.com
```

Then sign in on the site — the portal opens in a new tab and the main site stays on the storefront.

Or run (after `firebase login`):

```bash
pnpm seed:admin lotusms@outlook.com
```
