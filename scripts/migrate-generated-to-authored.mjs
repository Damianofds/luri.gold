import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(projectRoot, "src", "content", "generated");
const authoredDir = path.join(projectRoot, "src", "content", "site");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(fileName) {
  return JSON.parse(await fs.readFile(path.join(generatedDir, fileName), "utf8"));
}

async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  const [home, collections, pages, products] = await Promise.all([
    readJson("home.json"),
    readJson("collections.json"),
    readJson("pages.json"),
    readJson("products.json")
  ]);

  await writeJson(path.join(authoredDir, "home.json"), home);

  for (const collection of collections) {
    await writeJson(path.join(authoredDir, "collections", `${collection.slug}.json`), collection);
  }

  for (const page of pages) {
    await writeJson(path.join(authoredDir, "pages", `${page.slug}.json`), page);
  }

  for (const product of products) {
    await writeJson(path.join(authoredDir, "products", `${product.slug}.json`), product);
  }

  const paypalButtons = Object.fromEntries(
    products.flatMap((product) => [
      [product.slug, ""],
      ...(product.variants ?? []).filter((variant) => variant.sku).map((variant) => [variant.sku, ""])
    ])
  );

  await writeJson(path.join(authoredDir, "paypal-hosted-buttons.json"), paypalButtons);
}

await main();
