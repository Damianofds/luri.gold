export type Locale = "en" | "de" | "it";

export type LocalizedString = string | {
  en: string;
  de?: string;
  it?: string;
};

export interface SiteConfig {
  brandName: string;
  canonicalHost: string;
  basePath: string;
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
  autoplaySeconds: number;
  slides: Array<{
    title: LocalizedString;
    description: LocalizedString;
    ctaLabel: LocalizedString;
    image: string;
    href: string;
    imagePosition?: string;
  }>;
  sections: Array<{
    title: LocalizedString;
    description: LocalizedString;
    ctaLabel: LocalizedString;
    image: string;
    href: string;
    mediaPosition: "left" | "right";
    headingSize: "large" | "medium";
    imageAspectRatio: number;
    spacing: "compact" | "spacious" | "standard";
  }>;
}

export interface EditorialSection {
  title: LocalizedString;
  body: LocalizedString[];
  image?: string;
  images?: string[];
}

export interface EditorialPageRecord {
  slug: string;
  title: LocalizedString;
  intro: LocalizedString;
  heroImage: string;
  heroSourceUrl?: string;
  leadImages?: string[];
  sections: EditorialSection[];
}

export interface CollectionRecord {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
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
  title: LocalizedString;
  description: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString[];
  collectionLabel: string;
  collectionSlugs: string[];
  priceLabel: string;
  purchaseLabel: LocalizedString;
  shippingNote: LocalizedString;
  materialNote: string;
  optionLabels: Record<string, LocalizedString>;
  options: ProductOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  whatsappUrl: string;
  instagramUrl: string;
}
