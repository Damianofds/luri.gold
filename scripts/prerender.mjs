import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const distSsrDir = path.join(projectRoot, "dist-ssr");
const generatedDir = path.join(projectRoot, "src", "content", "generated");
const basePath = (process.env.VITE_BASE_PATH || "/").replace(/\/$/, "");

async function loadTemplate() {
  return fs.readFile(path.join(distDir, "index.html"), "utf8");
}

async function loadRenderer() {
  const entryFile = path.join(distSsrDir, "entry-server.js");
  try {
    await fs.access(entryFile);
  } catch {
    throw new Error("Server entry not found in dist-ssr.");
  }
  return import(pathToFileURL(entryFile).href);
}

function routeToOutputPath(route) {
  if (route === "/") {
    return path.join(distDir, "index.html");
  }
  const cleanRoute = route.replace(/^\//, "");
  return path.join(distDir, cleanRoute, "index.html");
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const template = await loadTemplate();
  const { render } = await loadRenderer();
  const routes = JSON.parse(await fs.readFile(path.join(generatedDir, "routes.json"), "utf8"));

  for (const route of routes) {
    const html = render(`${basePath}${route || "/"}` || "/");
    const outFile = routeToOutputPath(route);
    const page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    await ensureDir(outFile);
    await fs.writeFile(outFile, page, "utf8");
  }
}

await main();
