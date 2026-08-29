import type { SiteConfig } from "./types";
import paypalHostedButtons from "../content/site/paypal-hosted-buttons.json";

const assetBaseUrl = (import.meta.env.VITE_ASSET_BASE_URL || "/site-assets").replace(/\/$/, "");
const canonicalHost = (import.meta.env.VITE_SITE_URL || "https://luri.gold").replace(/\/$/, "");

export const siteConfig: SiteConfig = {
  brandName: "LURI jewels",
  canonicalHost,
  defaultLocale: "en",
  locales: ["en", "de", "it"],
  assetBaseUrl,
  contact: {
    email: "atelier@luri.gold",
    whatsappNumber: "393513955649",
    whatsappLabel: "+39 351 395 5649",
    instagramHandle: "luri.gold",
    instagramUrl: "https://www.instagram.com/luri.gold"
  },
  paypal: {
    mode: "hosted_button",
    clientId: "REPLACE_WITH_PAYPAL_CLIENT_ID_IF_NEEDED",
    currency: "EUR",
    merchantCountry: "DE",
    hostedButtons: paypalHostedButtons as Record<string, string>
  },
  shipping: {
    europeIncluded: true,
    nonEuropeMessage:
      "If you wish your jewels being shipped anywhere else in the world, shipping rates will be calculated accordingly on request.",
    returnsMessage: "Included return shipping is not available at this stage."
  }
};
