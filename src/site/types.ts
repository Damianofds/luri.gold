export type Locale = "en" | "de" | "it";

export type LocalizedString = Record<Locale, string> | string;

export interface SiteConfig {
  brandName: string;
  canonicalHost: string;
  defaultLocale: Locale;
  locales: Locale[];
  assetBaseUrl: string;
  contact: {
    email: string;
    whatsappNumber: string;
    whatsappLabel: string;
    instagramHandle: string;
    instagramUrl: string;
  };
  paypal: {
    mode: "hosted_button";
    clientId: string;
    currency: "EUR";
    merchantCountry: string;
    hostedButtons: Record<string, string>;
  };
  shipping: {
    europeIncluded: boolean;
    nonEuropeMessage: string;
    returnsMessage: string;
  };
}

export interface HomeContent {
  hero: {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    image: string;
  };
  sections: Array<{
    title?: Record<Locale, string>;
    description?: Record<Locale, string>;
    ctaLabel?: Record<Locale, string>;
    image?: string;
    href?: string;
  }>;
}

export interface EditorialSection {
  title: Record<Locale, string>;
  body: Array<Record<Locale, string>>;
  image?: string;
}

export interface EditorialPageRecord {
  slug: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  heroImage: string;
  heroSourceUrl?: string;
  sections: EditorialSection[];
}

export interface CollectionRecord {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  heroImage: string;
  heroSourceUrl?: string;
  productSlugs: string[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: number;
  title: string;
  sku: string;
  price: string;
  priceLabel: string;
  available: boolean;
  selectedOptions: Record<string, string>;
}

export interface ProductImage {
  path: string;
  sourceUrl?: string;
  alt: string;
}

export interface ProductRecord {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  longDescription: Array<Record<Locale, string>>;
  collectionLabel: string;
  collectionSlugs: string[];
  priceLabel: string;
  purchaseLabel: Record<Locale, string>;
  shippingNote: Record<Locale, string>;
  materialNote: string;
  optionLabels: Record<string, Record<Locale, string>>;
  options: ProductOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  whatsappUrl: string;
  instagramUrl: string;
}
