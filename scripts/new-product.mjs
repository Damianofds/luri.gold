import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const authoredDir = path.join(projectRoot, "src", "content", "site");
const assetDir = path.join(projectRoot, "public", "site-assets");
const paypalButtonsPath = path.join(authoredDir, "paypal-hosted-buttons.json");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/new-product.mjs <product-slug>");
  process.exit(1);
}

const filePath = path.join(authoredDir, "products", `${slug}.json`);
try {
  await fs.access(filePath);
  console.error(`Product already exists: ${slug}`);
  process.exit(1);
} catch {
  // continue
}

const template = {
  slug,
  title: { en: "", de: "", it: "" },
  description: { en: "", de: "", it: "" },
  shortDescription: { en: "", de: "", it: "" },
  longDescription: [{ en: "", de: "", it: "" }],
  collectionLabel: "",
  collectionSlugs: [],
  priceLabel: "EUR 0.00",
  purchaseLabel: {
    en: "Buy with PayPal",
    de: "Mit PayPal kaufen",
    it: "Acquista con PayPal"
  },
  shippingNote: {
    en: "Insured shipping within the EU is included. For delivery outside the EU, please contact us before ordering. Additional shipping costs may apply and will be calculated for your destination. All payments are in EUR.",
    de: "Der versicherte Versand innerhalb der EU ist inklusive. Bitte kontaktiere uns vor der Bestellung, wenn die Lieferung außerhalb der EU erfolgen soll. Je nach Lieferziel können zusätzliche Versandkosten anfallen, die wir für dich berechnen. Alle Zahlungen erfolgen ausschließlich in EUR.",
    it: "La spedizione assicurata all’interno dell’UE è inclusa. Per consegne fuori dall’UE, contattaci prima di ordinare. Potrebbero essere applicati costi di spedizione aggiuntivi, calcolati in base alla destinazione. Tutti i pagamenti sono accettati esclusivamente in EUR."
  },
  materialNote: "",
  optionLabels: {},
  options: [],
  variants: [
    {
      id: Date.now(),
      title: "Default Title",
      sku: slug,
      price: "0.00",
      priceLabel: "EUR 0.00",
      available: true,
      selectedOptions: {}
    }
  ],
  images: [
    {
      path: `products/${slug}/01.jpg`,
      alt: ""
    }
  ],
  whatsappUrl: `https://wa.me/393513955649?text=${encodeURIComponent(`Hello Lisa, I am interested in ${slug}.`)}`,
  instagramUrl: "https://www.instagram.com/luri.gold"
};

await fs.mkdir(path.dirname(filePath), { recursive: true });
await fs.writeFile(filePath, `${JSON.stringify(template, null, 2)}\n`, "utf8");
await fs.mkdir(path.join(assetDir, "products", slug), { recursive: true });

const paypalButtons = JSON.parse(await fs.readFile(paypalButtonsPath, "utf8"));
if (!(slug in paypalButtons)) {
  paypalButtons[slug] = "";
  await fs.writeFile(paypalButtonsPath, `${JSON.stringify(paypalButtons, null, 2)}\n`, "utf8");
}
