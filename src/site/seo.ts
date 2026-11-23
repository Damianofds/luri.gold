import { getCollectionBySlug, getPageBySlug, getProductBySlug } from "./catalog";
import { siteConfig } from "./config";
import { buildLocalizedPath, normalizeLocale, unlocalizedPath } from "./i18n";
import { t } from "./messages";
import type { Locale } from "./types";

export const studioSummary: Record<Locale, string> = {
  en: "LURI creates artisanal gold jewellery inspired by antique treasures, handmade in Italy with precious and traceable materials.",
  de: "LURI fertigt in Italien handgemachten Goldschmuck aus edlen, rückverfolgbaren Materialien, inspiriert von antiken Schätzen.",
  it: "LURI crea in Italia gioielli artigianali in oro, ispirati a tesori antichi e realizzati con materiali preziosi e tracciabili."
};

export function cleanText(text: string): string {
  return text.replace(/&(amp|#39|quot|nbsp|#160);/g, (_, entity: string) =>
    ({ amp: "&", "#39": "'", quot: '"', nbsp: " ", "#160": " " })[entity] ?? ""
  ).replace(/\s+/g, " ").replace(/ (?=[.,!?])/g, "").trim();
}

export function getPageMetadata(pathname: string) {
  const locale = normalizeLocale(pathname.split("/")[1]);
  const path = unlocalizedPath(pathname).replace(/\/$/, "") || "/";
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

  const indexable = Boolean(page || product || collection)
    || ["/", "/collections", "/collections/all", "/privacy-policy"].includes(path);
  const englishDescription = product && cleanText(getProductBySlug(slug, "en")?.description ?? "");
  const alternateLocales = siteConfig.locales.filter((entry) =>
    !product || entry === "en" || cleanText(getProductBySlug(slug, entry)?.description ?? "") !== englishDescription
  );
  const alternates = indexable && alternateLocales.length > 1 && alternateLocales.includes(locale)
    ? [
        ...alternateLocales.map((entry) => ({ language: entry, url: absolutePageUrl(entry, path) })),
        { language: "x-default", url: absolutePageUrl("en", path) }
      ]
    : [];

  return {
    locale,
    canonical: indexable ? absolutePageUrl(locale, path) : null,
    alternates,
    sitemap: indexable && alternateLocales.includes(locale),
    title: heading ? `${heading} | ${siteConfig.brandName}` : path === "/" ? `${t(locale, "studioHeading")} | ${siteConfig.brandName}` : siteConfig.brandName,
    description: summary || (heading ? `${heading} — ${studioSummary[locale]}` : studioSummary[locale])
  };
}


export function absolutePageUrl(locale: Locale, path: string): string {
  return `${siteConfig.canonicalHost}${siteConfig.basePath}${buildLocalizedPath(locale, path)}`;
}
