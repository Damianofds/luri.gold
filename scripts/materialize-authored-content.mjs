import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const authoredDir = path.join(projectRoot, "src", "content", "site");
const generatedDir = path.join(projectRoot, "src", "content", "generated");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function listJsonFiles(dirPath) {
  const entries = await fs.readdir(dirPath);
  return entries.filter((entry) => entry.endsWith(".json")).sort();
}

async function readDirectoryJson(dirPath) {
  const files = await listJsonFiles(dirPath);
  const results = [];
  for (const file of files) {
    results.push(await readJson(path.join(dirPath, file)));
  }
  return results;
}

async function writeJson(fileName, data) {
  await ensureDir(generatedDir);
  await fs.writeFile(path.join(generatedDir, fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function buildRoutes(pages, collections, products) {
  const routes = [
    "/",
    "/collections",
    "/collections/all",
    "/privacy-policy",
    "/policies/privacy-policy",
    "/pages/privacy",
    "/pages/custom",
    ...pages.map((page) => `/pages/${page.slug}`),
    ...collections.map((collection) => `/collections/${collection.slug}`),
    ...products.map((product) => `/products/${product.slug}`)
  ];

  return [
    ...new Set([
      ...routes,
      ...routes.flatMap((route) => ["/de", "/it"].map((prefix) => (route === "/" ? prefix : `${prefix}${route}`)))
    ])
  ];
}

async function main() {
  const [home, collections, pages, products] = await Promise.all([
    readJson(path.join(authoredDir, "home.json")),
    readDirectoryJson(path.join(authoredDir, "collections")),
    readDirectoryJson(path.join(authoredDir, "pages")),
    readDirectoryJson(path.join(authoredDir, "products"))
  ]);

  await writeJson("home.json", home);
  await writeJson("collections.json", collections);
  await writeJson("pages.json", pages);
  await writeJson("products.json", products);
  await writeJson("routes.json", buildRoutes(pages, collections, products));
}

await main();
