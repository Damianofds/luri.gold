import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const authoredDir = path.join(projectRoot, "src", "content", "site");
const assetDir = path.join(projectRoot, "public", "site-assets");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/new-collection.mjs <collection-slug>");
  process.exit(1);
}

const filePath = path.join(authoredDir, "collections", `${slug}.json`);
try {
  await fs.access(filePath);
  console.error(`Collection already exists: ${slug}`);
  process.exit(1);
} catch {
  // continue
}

const template = {
  slug,
  title: { en: "", de: "", it: "" },
  description: { en: "", de: "", it: "" },
  heroImage: `collections/${slug}/cover.jpg`,
  productSlugs: []
};

await fs.mkdir(path.dirname(filePath), { recursive: true });
await fs.writeFile(filePath, `${JSON.stringify(template, null, 2)}\n`, "utf8");
await fs.mkdir(path.join(assetDir, "collections", slug), { recursive: true });
