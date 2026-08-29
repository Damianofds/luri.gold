import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const productsDir = path.join(projectRoot, "src", "content", "site", "products");
const paypalButtonsPath = path.join(projectRoot, "src", "content", "site", "paypal-hosted-buttons.json");

async function listJsonFiles(dirPath) {
  const entries = await fs.readdir(dirPath);
  return entries.filter((entry) => entry.endsWith(".json")).sort();
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function main() {
  const productFiles = await listJsonFiles(productsDir);
  const paypalButtons = await readJson(paypalButtonsPath);

  for (const file of productFiles) {
    const product = await readJson(path.join(productsDir, file));
    if (!(product.slug in paypalButtons)) {
      paypalButtons[product.slug] = "";
    }
    for (const variant of product.variants ?? []) {
      if (variant.sku && !(variant.sku in paypalButtons)) {
        paypalButtons[variant.sku] = "";
      }
    }
  }

  const sorted = Object.fromEntries(Object.entries(paypalButtons).sort(([left], [right]) => left.localeCompare(right)));
  await fs.writeFile(paypalButtonsPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

await main();
