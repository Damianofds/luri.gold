import { assetUrl } from "./assets";
import { getProductBreadcrumbs, getProductBySlug } from "./catalog";
import { siteConfig } from "./config";
import { normalizeLocale, unlocalizedPath } from "./i18n";
import { absolutePageUrl, cleanText, studioSummary } from "./seo";

export function getStructuredData(pathname: string) {
  const locale = normalizeLocale(pathname.split("/")[1]);
  const path = unlocalizedPath(pathname);
  const homeUrl = absolutePageUrl("en", "/");
  const organizationId = `${homeUrl}#organization`;
  const imageUrl = (image: string) => new URL(assetUrl(image), homeUrl).href;
  const context = "https://schema.org";

  if (path === "/") {
    return {
      "@context": context,
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.brandName,
      url: homeUrl,
      logo: imageUrl("brand/logo-wordmark.png"),
      description: studioSummary[locale],
      email: siteConfig.contact.email,
      sameAs: [siteConfig.contact.instagramUrl]
    };
  }

  const match = path.match(/^\/products\/([^/]+)\/?$/);
  const product = match ? getProductBySlug(match[1], locale) : null;
  if (!product) return null;

  const url = absolutePageUrl(locale, path);
  const shownPrice = product.priceLabel.match(/^EUR (\d+\.\d{2})$/)?.[1];
  const fixedPrice = shownPrice && product.variants.length > 0
    && product.variants.every((variant) => Number(variant.price) === Number(shownPrice));
  // The storefront displays a contact-to-purchase price. Stock is confirmed by the studio.
  const offer = fixedPrice && !product.collectionSlugs.includes("one-of-a-kind")
    ? { "@type": "Offer", url, price: shownPrice, priceCurrency: siteConfig.paypal.currency }
    : undefined;

  return {
    "@context": context,
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        url,
        name: cleanText(product.title),
        description: cleanText(product.description),
        image: product.images.map((image) => imageUrl(image.path)),
        brand: { "@type": "Brand", name: siteConfig.brandName },
        offers: offer
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: getProductBreadcrumbs(product).map(({ label, path }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: cleanText(label),
          item: absolutePageUrl(locale, path)
        }))
      }
    ]
  };
}

export function serializeStructuredData(data: ReturnType<typeof getStructuredData>): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
