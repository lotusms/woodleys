import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const TARGET_DIRS = [
  path.join(ROOT, "public/images/products/rings"),
  path.join(ROOT, "public/images/products/watches"),
  path.join(ROOT, "public/images"),
];

/** @param {string} dir */
async function convertPngsInDir(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const converted = [];

  for (const name of entries) {
    if (!name.endsWith(".png")) continue;

    const inputPath = path.join(dir, name);
    const outputPath = path.join(dir, name.replace(/\.png$/i, ".webp"));

    try {
      const stat = await fs.stat(inputPath);
      if (!stat.isFile()) continue;

      await sharp(inputPath)
        .webp({ quality: 82, effort: 4 })
        .toFile(outputPath);

      const outStat = await fs.stat(outputPath);
      converted.push({
        file: path.relative(ROOT, outputPath),
        beforeKb: Math.round(stat.size / 1024),
        afterKb: Math.round(outStat.size / 1024),
      });
    } catch (error) {
      console.error(`Failed ${inputPath}:`, error);
    }
  }

  return converted;
}

const all = [];
for (const dir of TARGET_DIRS) {
  all.push(...(await convertPngsInDir(dir)));
}

const savedKb = all.reduce((sum, row) => sum + (row.beforeKb - row.afterKb), 0);
console.log(`Converted ${all.length} PNGs to WebP (saved ~${savedKb} KiB).`);
for (const row of all.sort((a, b) => b.beforeKb - a.beforeKb - (a.afterKb - b.afterKb))) {
  console.log(`  ${row.file}: ${row.beforeKb} KiB -> ${row.afterKb} KiB`);
}
