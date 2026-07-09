/**
 * Copies a Firebase service account JSON into .secrets/ and wires .env.local.
 *
 *   pnpm setup:firebase-admin ~/Downloads/woodleys-3c319-firebase-adminsdk-xxxxx.json
 *
 * Download the key: Firebase Console → woodleys-3c319 → Project settings →
 * Service accounts → Generate new private key
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.local");
const SECRETS_DIR = path.join(ROOT, ".secrets");
const KEY_PATH = path.join(SECRETS_DIR, "firebase-service-account.json");

const inputPath = process.argv[2];

if (!inputPath) {
  console.error(
    "Usage: pnpm setup:firebase-admin <path-to-service-account.json>",
  );
  console.error(
    "\nDownload from:\n  https://console.firebase.google.com/project/woodleys-3c319/settings/serviceaccounts/adminsdk",
  );
  process.exit(1);
}

const resolvedInput = path.resolve(inputPath);

let keyJson;
try {
  keyJson = JSON.parse(await fs.readFile(resolvedInput, "utf8"));
} catch {
  console.error(`Could not read JSON from ${resolvedInput}`);
  process.exit(1);
}

if (keyJson.type !== "service_account" || !keyJson.project_id || !keyJson.private_key) {
  console.error("File does not look like a Firebase service account JSON.");
  process.exit(1);
}

let expectedProject = "woodleys-3c319";
try {
  const envText = await fs.readFile(ENV_PATH, "utf8");
  const match = envText.match(/^NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.+)$/m);
  if (match?.[1]?.trim()) expectedProject = match[1].trim();
} catch {
  // .env.local may not exist yet
}

if (keyJson.project_id !== expectedProject) {
  console.error(
    `Wrong project: key is for "${keyJson.project_id}" but .env.local expects "${expectedProject}".`,
  );
  process.exit(1);
}

await fs.mkdir(SECRETS_DIR, { recursive: true });
await fs.writeFile(KEY_PATH, `${JSON.stringify(keyJson, null, 2)}\n`, {
  mode: 0o600,
});

const credentialsLine = `GOOGLE_APPLICATION_CREDENTIALS=${KEY_PATH}`;
const inlineJsonLine = `FIREBASE_SERVICE_ACCOUNT_JSON=${JSON.stringify(keyJson)}`;

let envText = "";
try {
  envText = await fs.readFile(ENV_PATH, "utf8");
} catch {
  envText = "";
}

const lines = envText
  .split("\n")
  .filter(
    (line) =>
      !line.startsWith("GOOGLE_APPLICATION_CREDENTIALS=") &&
      !line.startsWith("FIREBASE_SERVICE_ACCOUNT_JSON="),
  );

while (lines.length > 0 && lines[lines.length - 1] === "") {
  lines.pop();
}

lines.push("", "# Firebase Admin — server dashboard API (local + Vercel)", credentialsLine);
lines.push(
  "# For Vercel, also add FIREBASE_SERVICE_ACCOUNT_JSON as a single-line JSON env var.",
);
lines.push(`# ${inlineJsonLine.slice(0, 48)}…`);

await fs.writeFile(ENV_PATH, `${lines.join("\n")}\n`, "utf8");

console.log("Firebase Admin configured.");
console.log(`  Service account: ${KEY_PATH}`);
console.log(`  Updated: ${ENV_PATH}`);
console.log("\nRestart the dev server, then run: pnpm verify:firebase-admin");
