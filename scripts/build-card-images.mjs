import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = "dist/site-assets";
const products = JSON.parse(await fs.readFile("src/content/generated/products.json", "utf8"));
const collections = JSON.parse(await fs.readFile("src/content/generated/collections.json", "utf8"));
const images = new Set([
  ...products.flatMap((product) => product.images.slice(0, 2).map((image) => image.path)),
  ...collections.map((collection) => collection.heroImage)
]);

for (const image of images) {
  if (!image || /^https?:\/\//i.test(image)) continue;
  const output = path.join(outputDirectory, "cards", image);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await Promise.all([320, 640, 960].map((width) =>
    sharp(path.join("public/site-assets", image))
      .rotate()
      .resize({ width, height: width, fit: "cover" })
      .webp({ quality: 82 })
      .toFile(`${output}.${width}.webp`)
  ));
}
