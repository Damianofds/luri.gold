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

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function main() {
  const template = await loadTemplate();
  const { render, getPageMetadata, absolutePageUrl, getStructuredData, serializeStructuredData } = await loadRenderer();
  const routes = JSON.parse(await fs.readFile(path.join(generatedDir, "routes.json"), "utf8"));

  const sitemap = [];
  for (const route of routes) {
    const html = render(`${basePath}${route || "/"}` || "/");
    const outFile = routeToOutputPath(route);
    const metadata = getPageMetadata(route);
    if (metadata.sitemap) sitemap.push(`  <url><loc>${escapeHtml(metadata.canonical)}</loc></url>`);
    const links = metadata.canonical
      ? [
          `<link rel="canonical" data-page-seo href="${escapeHtml(metadata.canonical)}" />`,
          ...metadata.alternates.map(({ language, url }) =>
            `<link rel="alternate" data-page-seo hreflang="${language}" href="${escapeHtml(url)}" />`)
        ]
      : ['<meta name="robots" content="noindex" data-page-seo />'];
    const structuredData = getStructuredData(route);
    if (structuredData) {
      links.push(`<script type="application/ld+json" data-structured-data>${serializeStructuredData(structuredData)}</script>`);
    }
    const page = template
      .replace('<html lang="en">', `<html lang="${metadata.locale}">`)
      .replace("</head>", () => `  ${links.join("\n    ")}\n  </head>`)
      .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(metadata.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, () =>
        `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
      .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
    await ensureDir(outFile);
    await fs.writeFile(outFile, page, "utf8");
  }
  await fs.writeFile(path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.join("\n")}\n</urlset>\n`);
  const robotsPath = path.join(distDir, "robots.txt");
  const robots = (await fs.readFile(robotsPath, "utf8")).trimEnd();
  await fs.writeFile(robotsPath, `${robots}\nSitemap: ${absolutePageUrl("en", "/")}sitemap.xml\n`);
}

await main();
