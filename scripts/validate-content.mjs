import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const authoredDir = path.join(projectRoot, "src", "content", "site");
const assetDir = path.join(projectRoot, "public", "site-assets");
const locales = ["en", "de", "it"];
const strictPayPal = process.env.STRICT_PAYPAL === "1";
const strictOptionalTranslations = process.env.STRICT_OPTIONAL_TRANSLATIONS === "1";

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function listJsonFiles(dirPath) {
  const entries = await fs.readdir(dirPath);
  return entries.filter((entry) => entry.endsWith(".json")).sort();
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function checkLocalizedField(record, fieldName, value, fileLabel, errors, { requiredEnglish = true } = {}) {
  if (typeof value === "string") {
    if (requiredEnglish) {
      assert(value.trim().length > 0, `${fileLabel}: field "${fieldName}" is required.`, errors);
    }
    return;
  }
  if (!value || typeof value !== "object") {
    errors.push(`${fileLabel}: field "${fieldName}" must be a string or localized object.`);
    return;
  }
  if (requiredEnglish) {
    assert(typeof value.en === "string" && value.en.trim().length > 0, `${fileLabel}: field "${fieldName}.en" is required.`, errors);
  } else if (strictOptionalTranslations && value.en != null) {
    assert(typeof value.en === "string", `${fileLabel}: field "${fieldName}.en" must be a string.`, errors);
  }
  for (const locale of locales) {
    if (value[locale] != null) {
      assert(typeof value[locale] === "string", `${fileLabel}: field "${fieldName}.${locale}" must be a string.`, errors);
    }
  }
}

async function validateAssets(paths, errors) {
  for (const assetPath of paths) {
    const existsOnDisk = await exists(path.join(assetDir, assetPath));
    assert(existsOnDisk, `Missing asset: public/site-assets/${assetPath}`, errors);
  }
}

async function main() {
  const errors = [];
  const warnings = [];
  const productFiles = await listJsonFiles(path.join(authoredDir, "products"));
  const collectionFiles = await listJsonFiles(path.join(authoredDir, "collections"));
  const pageFiles = await listJsonFiles(path.join(authoredDir, "pages"));
  const [home, paypalButtons] = await Promise.all([
    readJson(path.join(authoredDir, "home.json")),
    readJson(path.join(authoredDir, "paypal-hosted-buttons.json"))
  ]);

  assert(Number.isFinite(home.autoplaySeconds) && home.autoplaySeconds > 0, "home.json: autoplaySeconds must be positive.", errors);
  assert(Array.isArray(home.slides) && home.slides.length > 0, "home.json: must have at least one slide.", errors);
  for (const [index, slide] of (home.slides ?? []).entries()) {
    checkLocalizedField(slide, `slides[${index}].title`, slide.title, "home.json", errors);
    checkLocalizedField(slide, `slides[${index}].description`, slide.description, "home.json", errors);
    checkLocalizedField(slide, `slides[${index}].ctaLabel`, slide.ctaLabel, "home.json", errors);
    assert(typeof slide.href === "string" && slide.href.startsWith("/"), `home.json: slides[${index}].href must be an absolute site path.`, errors);
  }
  for (const [index, section] of (home.sections ?? []).entries()) {
    checkLocalizedField(section, `sections[${index}].title`, section.title, "home.json", errors);
    checkLocalizedField(section, `sections[${index}].description`, section.description, "home.json", errors);
    checkLocalizedField(section, `sections[${index}].ctaLabel`, section.ctaLabel, "home.json", errors);
  }
  await validateAssets([
    ...(home.slides ?? []).map((slide) => slide.image),
    ...(home.sections ?? []).map((section) => section.image)
  ], errors);

  const productSlugs = new Set();
  for (const file of productFiles) {
    const product = await readJson(path.join(authoredDir, "products", file));
    const label = `products/${file}`;
    assert(!productSlugs.has(product.slug), `${label}: duplicate slug "${product.slug}"`, errors);
    productSlugs.add(product.slug);
    checkLocalizedField(product, "title", product.title, label, errors);
    checkLocalizedField(product, "description", product.description, label, errors);
    checkLocalizedField(product, "shortDescription", product.shortDescription, label, errors);
    checkLocalizedField(product, "purchaseLabel", product.purchaseLabel, label, errors);
    checkLocalizedField(product, "shippingNote", product.shippingNote, label, errors);
    assert(Array.isArray(product.variants) && product.variants.length > 0, `${label}: must have at least one variant`, errors);
    await validateAssets((product.images ?? []).map((image) => image.path), errors);
    const paypalKeyPresent =
      Boolean(paypalButtons[product.slug]) ||
      (product.variants ?? []).some((variant) => variant.sku && paypalButtons[variant.sku]);
    if (!paypalKeyPresent) {
      const message = `${label}: missing PayPal hosted button mapping for product "${product.slug}"`;
      if (strictPayPal) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    }
  }

  for (const file of collectionFiles) {
    const collection = await readJson(path.join(authoredDir, "collections", file));
    const label = `collections/${file}`;
    checkLocalizedField(collection, "title", collection.title, label, errors);
    checkLocalizedField(collection, "description", collection.description, label, errors, { requiredEnglish: false });
    await validateAssets([collection.heroImage], errors);
    for (const productSlug of collection.productSlugs ?? []) {
      assert(productSlugs.has(productSlug), `${label}: unknown product slug "${productSlug}"`, errors);
    }
  }

  for (const file of pageFiles) {
    const page = await readJson(path.join(authoredDir, "pages", file));
    const label = `pages/${file}`;
    checkLocalizedField(page, "title", page.title, label, errors);
    checkLocalizedField(page, "intro", page.intro, label, errors);
    for (const [index, section] of (page.sections ?? []).entries()) {
      checkLocalizedField(section, `sections[${index}].title`, section.title, label, errors, { requiredEnglish: false });
      for (const [paragraphIndex, paragraph] of (section.body ?? []).entries()) {
        checkLocalizedField(section, `sections[${index}].body[${paragraphIndex}]`, paragraph, label, errors);
      }
    }
    await validateAssets([
      page.heroImage,
      ...(page.leadImages ?? []),
      ...(page.sections ?? []).flatMap((section) => [section.image, ...(section.images ?? [])]).filter(Boolean)
    ], errors);
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(warnings.join("\n"));
  }
}

await main();
