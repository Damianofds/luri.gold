import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const snapshotDir = path.join(projectRoot, ".cache", "live-snapshot");
const generatedDir = path.join(projectRoot, "src", "content", "generated");

const localePrefixes = {
  en: "",
  de: "/de",
  it: "/it"
};

const collectionOrder = [
  "frontpage",
  "bracelets",
  "earrings",
  "pendants",
  "rings",
  "liebe",
  "one-of-a-kind"
];

const collectionTitles = {
  frontpage: {
    en: "Zodiac Collection",
    de: "Zodiac Kollektion",
    it: "Collezione Zodiac"
  }
};

function stripHtml(input) {
  return input
    .replace(/<meta[^>]*>/g, " ")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/p>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\n /g, "\n")
    .trim();
}

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readJson(fileName) {
  return JSON.parse(await fs.readFile(path.join(snapshotDir, fileName), "utf8"));
}

async function readHtml(fileName) {
  return fs.readFile(path.join(snapshotDir, fileName), "utf8");
}

function extractTitle(html) {
  const match = html.match(/<title>\s*([\s\S]*?)\s*(?:&ndash;|-)\s*LURI jewels<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function extractDescriptionMeta(html) {
  const match = html.match(/<meta name="description" content="([\s\S]*?)">/i);
  return match ? match[1].replace(/&quot;/g, '"').trim() : "";
}

function extractOgImage(html) {
  const match = html.match(/<meta property="og:image(?::secure_url)?" content="([^"]+)"/i);
  return match ? match[1].replace(/^http:\/\//, "https://") : "";
}

function extractMainBodyHtml(html) {
  const start = html.indexOf('<main id="MainContent"');
  const end = html.indexOf("</main>");
  if (start === -1 || end === -1) {
    return "";
  }
  return html.slice(start, end);
}

function extractParagraphs(html) {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  return matches
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
}

function extractHeadings(html) {
  const matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  return matches
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
}

function unique(list) {
  return [...new Set(list)];
}

function mapVariant(product, variant) {
  const selectedOptions = {};
  product.options.forEach((option, index) => {
    const value = variant[`option${index + 1}`];
    if (option.name && value) {
      selectedOptions[option.name] = value;
    }
  });

  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku || "",
    price: variant.price,
    priceLabel: `EUR ${Number(variant.price).toFixed(2)}`,
    available: Boolean(variant.available ?? true),
    selectedOptions
  };
}

function mapOptions(product) {
  return product.options.map((option) => ({
    name: option.name,
    values: option.values
  }));
}

function mapImages(product) {
  return product.images.map((image, index) => {
    const ext = path.extname(new URL(image.src).pathname) || ".jpg";
    return {
      path: `products/${product.handle}/${String(index + 1).padStart(2, "0")}${ext}`,
      sourceUrl: image.src,
      alt: image.alt || product.title
    };
  });
}

function parseProductLocaleHtml(html) {
  const title = extractTitle(html);
  const description = extractDescriptionMeta(html);
  return {
    title,
    description
  };
}

async function loadLocaleProductHtml(locale, handle) {
  const fileName = `luri-product-${locale}-${handle}.html`;
  return readHtml(fileName);
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeJson(fileName, data) {
  await ensureDir(generatedDir);
  await fs.writeFile(path.join(generatedDir, fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function collectProducts() {
  const productFeed = await readJson("luri-all-products.json");
  const collectionFiles = Object.fromEntries(
    await Promise.all(
      collectionOrder.map(async (slug) => [slug, await readJson(`luri-${slug}.json`)])
    )
  );

  const collectionMembership = {};
  for (const [slug, data] of Object.entries(collectionFiles)) {
    for (const product of data.products) {
      collectionMembership[product.handle] ??= [];
      collectionMembership[product.handle].push(slug);
    }
  }

  const products = [];

  for (const product of productFeed.products) {
    const localized = {};
    for (const locale of ["en", "de", "it"]) {
      const html = await loadLocaleProductHtml(locale, product.handle);
      localized[locale] = parseProductLocaleHtml(html);
    }

    const variants = product.variants.map((variant) => mapVariant(product, variant));
    const firstPrice = variants[0]?.price ?? "0.00";

    products.push({
      slug: product.handle,
      title: {
        en: localized.en.title || product.title,
        de: localized.de.title || product.title,
        it: localized.it.title || product.title
      },
      description: {
        en: localized.en.description || stripHtml(product.body_html),
        de: localized.de.description || stripHtml(product.body_html),
        it: localized.it.description || stripHtml(product.body_html)
      },
      shortDescription: {
        en: stripHtml(product.body_html).slice(0, 160),
        de: localized.de.description || stripHtml(product.body_html).slice(0, 160),
        it: localized.it.description || stripHtml(product.body_html).slice(0, 160)
      },
      longDescription: [
        {
          en: stripHtml(product.body_html),
          de: localized.de.description || stripHtml(product.body_html),
          it: localized.it.description || stripHtml(product.body_html)
        }
      ],
      collectionLabel: unique(collectionMembership[product.handle] ?? [])
        .map((slug) => slug.replace(/-/g, " "))
        .join(" / "),
      collectionSlugs: unique(collectionMembership[product.handle] ?? []),
      priceLabel: `EUR ${Number(firstPrice).toFixed(2)}`,
      purchaseLabel: {
        en: "Buy with PayPal",
        de: "Mit PayPal kaufen",
        it: "Acquista con PayPal"
      },
      shippingNote: {
        en: "Insured shipping in Europe is included. For non-European destinations, shipping is calculated on request.",
        de: "Versicherter Versand in Europa ist inklusive. Für Ziele außerhalb Europas werden die Versandkosten auf Anfrage berechnet.",
        it: "La spedizione assicurata in Europa è inclusa. Per destinazioni extraeuropee il costo viene calcolato su richiesta."
      },
      materialNote: stripHtml(product.body_html),
      optionLabels: Object.fromEntries(
        mapOptions(product).map((option) => [
          option.name,
          {
            en: option.name,
            de: option.name === "Ring size" ? "Ringgröße" : option.name,
            it: option.name === "Ring size" ? "Misura anello" : option.name
          }
        ])
      ),
      options: mapOptions(product),
      variants,
      images: mapImages(product),
      whatsappUrl: `https://wa.me/393513955649?text=${encodeURIComponent(
        `Hello Lisa, I am interested in ${localized.en.title || product.title}.`
      )}`,
      instagramUrl: "https://www.instagram.com/luri.gold"
    });
  }

  return products;
}

async function collectCollections(products) {
  const result = [];

  for (const slug of collectionOrder) {
    const html = await readHtml(`luri-collection-${slug}-en.html`);
    const htmlDe = await readHtml(`luri-collection-${slug}-de.html`);
    const htmlIt = await readHtml(`luri-collection-${slug}-it.html`);
    const titleEn = extractTitle(html);
    const titleDe = extractTitle(htmlDe);
    const titleIt = extractTitle(htmlIt);

    result.push({
      slug,
      title: {
        en: collectionTitles[slug]?.en || titleEn,
        de: collectionTitles[slug]?.de || titleDe || titleEn,
        it: collectionTitles[slug]?.it || titleIt || titleEn
      },
      description: {
        en: extractDescriptionMeta(html),
        de: extractDescriptionMeta(htmlDe) || extractDescriptionMeta(html),
        it: extractDescriptionMeta(htmlIt) || extractDescriptionMeta(html)
      },
      heroImage: `collections/${slug}/cover${path.extname(new URL(extractOgImage(html)).pathname) || ".jpg"}`,
      heroSourceUrl: extractOgImage(html),
      productSlugs: products.filter((product) => product.collectionSlugs.includes(slug)).map((product) => product.slug)
    });
  }

  return result;
}

async function collectPages() {
  const pageSlugs = [
    "about",
    "contact",
    "payment-shipping",
    "bespoke",
    "zodiac-collection",
    "heirloom-transformation"
  ];

  const result = [];

  for (const slug of pageSlugs) {
    const perLocale = {};
    for (const locale of ["en", "de", "it"]) {
      perLocale[locale] = await readHtml(`luri-page-${slug}-${locale}.html`);
    }

    const sections = [];
    const headings = extractHeadings(extractMainBodyHtml(perLocale.en));
    const paragraphsEn = extractParagraphs(extractMainBodyHtml(perLocale.en));
    const paragraphsDe = extractParagraphs(extractMainBodyHtml(perLocale.de));
    const paragraphsIt = extractParagraphs(extractMainBodyHtml(perLocale.it));

    const bodyCount = Math.max(paragraphsEn.length, paragraphsDe.length, paragraphsIt.length);
    for (let index = 0; index < bodyCount; index += 1) {
      sections.push({
        title: {
          en: headings[index] || "",
          de: extractHeadings(extractMainBodyHtml(perLocale.de))[index] || headings[index] || "",
          it: extractHeadings(extractMainBodyHtml(perLocale.it))[index] || headings[index] || ""
        },
        body: [
          {
            en: paragraphsEn[index] || "",
            de: paragraphsDe[index] || paragraphsEn[index] || "",
            it: paragraphsIt[index] || paragraphsEn[index] || ""
          }
        ].filter((paragraph) => paragraph.en || paragraph.de || paragraph.it)
      });
    }

    result.push({
      slug,
      title: {
        en: extractTitle(perLocale.en),
        de: extractTitle(perLocale.de) || extractTitle(perLocale.en),
        it: extractTitle(perLocale.it) || extractTitle(perLocale.en)
      },
      intro: {
        en: extractParagraphs(extractMainBodyHtml(perLocale.en))[0] || extractDescriptionMeta(perLocale.en),
        de: extractParagraphs(extractMainBodyHtml(perLocale.de))[0] || extractDescriptionMeta(perLocale.de),
        it: extractParagraphs(extractMainBodyHtml(perLocale.it))[0] || extractDescriptionMeta(perLocale.it)
      },
      heroImage: `pages/${slug}/hero${path.extname(new URL(extractOgImage(perLocale.en)).pathname) || ".jpg"}`,
      heroSourceUrl: extractOgImage(perLocale.en),
      sections
    });
  }

  return result;
}

function buildHome(collections) {
  const frontpage = collections.find((collection) => collection.slug === "frontpage");
  return {
    hero: {
      title: {
        en: "Crafted by hand in high karat gold",
        de: "Von Hand gefertigt in hochkarätigem Gold",
        it: "Creato a mano in oro ad alta caratura"
      },
      description: {
        en: "Jewels inspired by antiquity, made to be worn close to the heart and kept for generations.",
        de: "Von der Antike inspirierte Schmuckstücke, geschaffen um nah am Herzen getragen und über Generationen bewahrt zu werden.",
        it: "Gioielli ispirati all'antichità, creati per essere indossati vicino al cuore e custoditi per generazioni."
      },
      image: frontpage ? frontpage.heroImage : "home/hero/hero-main.jpg"
    },
    sections: []
  };
}

async function copyIfPresent(sourcePath, targetPath) {
  try {
    await ensureDir(path.dirname(targetPath));
    await fs.copyFile(sourcePath, targetPath);
  } catch {
    // Ignore missing files for now. The author can replace them with master assets later.
  }
}

async function main() {
  const products = await collectProducts();
  const collections = await collectCollections(products);
  const pages = await collectPages();
  const home = buildHome(collections);
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
  const localizedRoutes = [...new Set([
    ...routes,
    ...routes.flatMap((route) => ["/de", "/it"].map((prefix) => (route === "/" ? prefix : `${prefix}${route}`)))
  ])];

  await writeJson("products.json", products);
  await writeJson("collections.json", collections);
  await writeJson("pages.json", pages);
  await writeJson("home.json", home);
  await writeJson("routes.json", localizedRoutes);
}

await main();
