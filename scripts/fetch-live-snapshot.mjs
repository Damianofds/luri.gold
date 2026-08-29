import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, ".cache", "live-snapshot");

const locales = ["en", "de", "it"];
const collectionSlugs = ["frontpage", "bracelets", "earrings", "pendants", "rings", "liebe", "one-of-a-kind"];
const pageSlugs = ["about", "contact", "payment-shipping", "bespoke", "zodiac-collection", "heirloom-transformation"];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Codex static clone snapshot"
    }
  });
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after") || "10");
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return fetchText(url);
  }
  if (!response.ok) {
    throw new Error(`Failed ${response.status} for ${url}`);
  }
  return response.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function writeFile(fileName, contents) {
  await ensureDir(outDir);
  await fs.writeFile(path.join(outDir, fileName), contents, "utf8");
}

async function exists(fileName) {
  try {
    await fs.access(path.join(outDir, fileName));
    return true;
  } catch {
    return false;
  }
}

async function fetchProductAndCollectionFeeds() {
  const allProducts = await fetchJson("https://luri.gold/collections/all/products.json?limit=250");
  await writeFile("luri-all-products.json", `${JSON.stringify(allProducts, null, 2)}\n`);

  for (const slug of collectionSlugs) {
    const data = await fetchJson(`https://luri.gold/collections/${slug}/products.json?limit=250`);
    await writeFile(`luri-${slug}.json`, `${JSON.stringify(data, null, 2)}\n`);
  }

  return allProducts.products.map((product) => product.handle);
}

async function fetchLocalizedPages(handles) {
  const pageUrls = [];

  for (const slug of pageSlugs) {
    for (const locale of locales) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      pageUrls.push({
        file: `luri-page-${slug}-${locale}.html`,
        url: `https://luri.gold${prefix}/pages/${slug}`
      });
    }
  }

  for (const slug of collectionSlugs) {
    for (const locale of locales) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      pageUrls.push({
        file: `luri-collection-${slug}-${locale}.html`,
        url: `https://luri.gold${prefix}/collections/${slug}`
      });
    }
  }

  for (const handle of handles) {
    for (const locale of locales) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      pageUrls.push({
        file: `luri-product-${locale}-${handle}.html`,
        url: `https://luri.gold${prefix}/products/${handle}`
      });
    }
  }

  for (const entry of pageUrls) {
    if (await exists(entry.file)) {
      continue;
    }
    const html = await fetchText(entry.url);
    await writeFile(entry.file, html);
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

await ensureDir(outDir);
const handles = await fetchProductAndCollectionFeeds();
await fetchLocalizedPages(handles);
