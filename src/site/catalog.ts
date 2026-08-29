import { homePage, pages, collections, products } from "../content/loaders";
import { localizeValue, normalizeLocale } from "./i18n";
import { siteConfig } from "./config";
import type { CollectionRecord, EditorialPageRecord, Locale, ProductRecord } from "./types";

export interface HomePageView {
  locale: Locale;
  autoplaySeconds: number;
  slides: Array<{
    image: string;
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
    imagePosition?: string;
  }>;
  sections: Array<{
    title: string;
    description: string;
    ctaLabel: string;
    image: string;
    href: string;
    mediaPosition: "left" | "right";
    headingSize: "large" | "medium";
    imageAspectRatio: number;
    spacing: "compact" | "spacious" | "standard";
  }>;
}

export interface EditorialPageView extends Omit<EditorialPageRecord, "title" | "intro" | "sections"> {
  locale: Locale;
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string[];
    image?: string;
    images?: string[];
  }>;
}

export interface CollectionView extends Omit<CollectionRecord, "title" | "description"> {
  locale: Locale;
  title: string;
  description: string;
  products: ProductView[];
}

export interface ProductView extends Omit<ProductRecord, "title" | "description" | "shortDescription" | "longDescription" | "purchaseLabel" | "shippingNote" | "optionLabels"> {
  locale: Locale;
  title: string;
  description: string;
  shortDescription: string;
  longDescription: string[];
  purchaseLabel: string;
  shippingNote: string;
  optionLabels: Record<string, string>;
}

export function getHomePage(locale: Locale): HomePageView {
  const resolvedLocale = normalizeLocale(locale);
  return {
    locale: resolvedLocale,
    autoplaySeconds: homePage.autoplaySeconds,
    slides: homePage.slides.map((slide) => ({
      image: slide.image,
      title: localizeValue(slide.title, resolvedLocale),
      description: localizeValue(slide.description, resolvedLocale),
      ctaLabel: localizeValue(slide.ctaLabel, resolvedLocale),
      href: slide.href,
      imagePosition: slide.imagePosition
    })),
    sections: homePage.sections.map((section) => ({
      title: localizeValue(section.title, resolvedLocale),
      description: localizeValue(section.description, resolvedLocale),
      ctaLabel: localizeValue(section.ctaLabel, resolvedLocale),
      image: section.image,
      href: section.href,
      mediaPosition: section.mediaPosition,
      headingSize: section.headingSize,
      imageAspectRatio: section.imageAspectRatio,
      spacing: section.spacing
    }))
  };
}

export function getPageBySlug(slug: string, locale: Locale): EditorialPageView | null {
  const record = pages.find((page) => page.slug === slug);
  if (!record) {
    return null;
  }

  const resolvedLocale = normalizeLocale(locale);
  return {
    ...record,
    locale: resolvedLocale,
    title: localizeValue(record.title, resolvedLocale),
    intro: localizeValue(record.intro, resolvedLocale),
    sections: record.sections.map((section) => ({
      title: localizeValue(section.title, resolvedLocale),
      body: section.body.map((paragraph) => localizeValue(paragraph, resolvedLocale)),
      image: section.image,
      images: section.images
    }))
  };
}

export function getCollectionBySlug(slug: string, locale: Locale): CollectionView | null {
  const record = collections.find((collection) => collection.slug === slug);
  if (!record) {
    return null;
  }
  const resolvedLocale = normalizeLocale(locale);
  return {
    ...record,
    locale: resolvedLocale,
    title: localizeValue(record.title, resolvedLocale),
    description: localizeValue(record.description, resolvedLocale),
    products: record.productSlugs.map((productSlug) => getProductBySlug(productSlug, resolvedLocale)).filter(Boolean) as ProductView[]
  };
}

export function getCollections(locale: Locale): CollectionView[] {
  return collections.map((collection) => getCollectionBySlug(collection.slug, locale)).filter(Boolean) as CollectionView[];
}

export function getProductBySlug(slug: string, locale: Locale): ProductView | null {
  const record = products.find((product) => product.slug === slug);
  if (!record) {
    return null;
  }
  const resolvedLocale = normalizeLocale(locale);
  return {
    ...record,
    locale: resolvedLocale,
    title: localizeValue(record.title, resolvedLocale),
    description: localizeValue(record.description, resolvedLocale),
    shortDescription: localizeValue(record.shortDescription, resolvedLocale),
    longDescription: record.longDescription.map((paragraph) => localizeValue(paragraph, resolvedLocale)),
    purchaseLabel: localizeValue(record.purchaseLabel, resolvedLocale),
    shippingNote: localizeValue(record.shippingNote, resolvedLocale),
    optionLabels: Object.fromEntries(
      Object.entries(record.optionLabels).map(([key, value]) => [key, localizeValue(value, resolvedLocale)])
    )
  };
}

export function getProducts(locale: Locale): ProductView[] {
  const resolvedLocale = normalizeLocale(locale);
  return products
    .map((product) => getProductBySlug(product.slug, resolvedLocale))
    .filter(Boolean) as ProductView[];
}

export function getRelatedProducts(product: ProductView, locale: Locale): ProductView[] {
  const sourceCollection = product.collectionSlugs.find((slug) => collections.some((collection) => collection.slug === slug));
  if (!sourceCollection) {
    return [];
  }
  return getCollectionBySlug(sourceCollection, locale)?.products.filter((entry) => entry.slug !== product.slug).slice(0, 4) ?? [];
}

export function getAllStaticRoutes(): string[] {
  const routes = new Set<string>();
  routes.add("/");
  routes.add("/collections");
  routes.add("/collections/all");
  routes.add("/privacy-policy");
  routes.add("/policies/privacy-policy");
  routes.add("/pages/privacy");
  routes.add("/pages/custom");

  for (const page of pages) {
    routes.add(`/pages/${page.slug}`);
  }
  for (const collection of collections) {
    routes.add(`/collections/${collection.slug}`);
  }
  for (const product of products) {
    routes.add(`/products/${product.slug}`);
  }

  const localized = new Set<string>();
  for (const route of routes) {
    localized.add(route);
    for (const locale of siteConfig.locales) {
      if (locale === siteConfig.defaultLocale) {
        continue;
      }
      localized.add(route === "/" ? `/${locale}` : `/${locale}${route}`);
    }
  }

  return [...localized];
}
