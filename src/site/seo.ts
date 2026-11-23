import { getCollectionBySlug, getPageBySlug, getProductBySlug } from "./catalog";
import { siteConfig } from "./config";
import { normalizeLocale } from "./i18n";
import { t } from "./messages";
import type { Locale } from "./types";

const studioSummary: Record<Locale, string> = {
  en: "LURI creates artisanal gold jewellery inspired by antique treasures, handmade in Italy with precious and traceable materials.",
  de: "LURI fertigt in Italien handgemachten Goldschmuck aus edlen, rückverfolgbaren Materialien, inspiriert von antiken Schätzen.",
  it: "LURI crea in Italia gioielli artigianali in oro, ispirati a tesori antichi e realizzati con materiali preziosi e tracciabili."
};

function cleanText(text: string): string {
  return text.replace(/&(amp|#39|quot|nbsp|#160);/g, (_, entity: string) =>
    ({ amp: "&", "#39": "'", quot: '"', nbsp: " ", "#160": " " })[entity] ?? ""
  ).replace(/\s+/g, " ").trim();
}

export function getPageMetadata(pathname: string) {
  const locale = normalizeLocale(pathname.split("/")[1]);
  const path = pathname.replace(/^\/(de|it)(?=\/|$)/, "").replace(/\/$/, "") || "/";
  const [, section, slug] = path.split("/");
  const page = section === "pages" ? getPageBySlug(slug, locale) : null;
  const product = section === "products" ? getProductBySlug(slug, locale) : null;
  const collection = section === "collections" ? getCollectionBySlug(slug, locale) : null;
  const title = product?.title ?? collection?.title ?? page?.title
    ?? (section === "collections" ? t(locale, slug === "all" ? "allProductsTitle" : "collectionsTitle")
      : path === "/privacy-policy" ? t(locale, "footerPrivacy") : "");
  const heading = cleanText(title).replace(/^LURI(?: jewels)?\s*-\s*/i, "");
  const description = cleanText(product?.description || collection?.description || page?.intro || "");
  const summary = description.length > 165
    ? description.slice(0, 162).replace(/\s+\S*$/, "") + "…"
    : description;

  return {
    title: heading ? `${heading} | ${siteConfig.brandName}` : siteConfig.brandName,
    description: summary || (heading ? `${heading} — ${studioSummary[locale]}` : studioSummary[locale])
  };
}
