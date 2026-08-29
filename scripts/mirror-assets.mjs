import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const contentDir = path.join(projectRoot, "src", "content", "generated");
const assetDir = path.join(projectRoot, "public", "site-assets");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(fileName) {
  return JSON.parse(await fs.readFile(path.join(contentDir, fileName), "utf8"));
}

async function download(url, outPath) {
  if (!url) {
    return;
  }
  try {
    await fs.access(outPath);
    return;
  } catch {
    // continue
  }

  const response = await fetch(url, {
    headers: {
      "user-agent": "Codex asset mirror"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed ${response.status} for ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, Buffer.from(arrayBuffer));
}

async function main() {
  const [products, collections, pages, home] = await Promise.all([
    readJson("products.json"),
    readJson("collections.json"),
    readJson("pages.json"),
    readJson("home.json")
  ]);

  for (const collection of collections) {
    await download(collection.heroSourceUrl, path.join(assetDir, collection.heroImage));
  }

  for (const page of pages) {
    await download(page.heroSourceUrl, path.join(assetDir, page.heroImage));
  }

  if (home?.hero?.image) {
    const source = collections.find((collection) => collection.heroImage === home.hero.image)?.heroSourceUrl;
    await download(source, path.join(assetDir, home.hero.image));
  }

  for (const product of products) {
    for (const image of product.images) {
      await download(image.sourceUrl, path.join(assetDir, image.path));
    }
  }
}

await ensureDir(assetDir);
await main();
