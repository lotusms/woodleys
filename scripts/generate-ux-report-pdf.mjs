#!/usr/bin/env node
/**
 * Converts docs/UX-REPORT.md to docs/UX-REPORT.pdf using local Chrome.
 * Usage: node scripts/generate-ux-report-pdf.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mdPath = join(root, "docs/UX-REPORT.md");
const cssPath = join(root, "docs/ux-report-pdf.css");
const bodyPath = join(root, "docs/UX-REPORT-body.html");
const htmlPath = join(root, "docs/UX-REPORT.html");
const pdfPath = join(root, "docs/UX-REPORT.pdf");

execSync(`npx --yes marked -i "${mdPath}" -o "${bodyPath}"`, {
  cwd: root,
  stdio: "inherit",
});

const css = readFileSync(cssPath, "utf8");
const body = readFileSync(bodyPath, "utf8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Woodley's Jewelers — User Experience Report</title>
  <style>${css}</style>
</head>
<body>${body}</body>
</html>`;

writeFileSync(htmlPath, html);

const chrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--print-to-pdf=${pdfPath}`,
    "--print-to-pdf-no-header",
    `file://${htmlPath}`,
  ],
  { stdio: "inherit" },
);

console.log(`PDF written to ${pdfPath}`);
