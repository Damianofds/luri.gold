import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

async function writeNoJekyll() {
  await fs.writeFile(path.join(distDir, ".nojekyll"), "", "utf8");
}

await writeNoJekyll();
