import { siteConfig } from "./config";
import type { ProductView } from "./catalog";
import type { ProductVariant } from "./types";

function buttonKey(product: ProductView, selectedVariant: ProductVariant | null): string {
  return selectedVariant?.sku || `${product.slug}:${selectedVariant?.id ?? "default"}`;
}

export function getPayPalButton(product: ProductView, selectedVariant: ProductVariant | null): string | null {
  const key = buttonKey(product, selectedVariant);
  return siteConfig.paypal.hostedButtons[key] ?? siteConfig.paypal.hostedButtons[product.slug] ?? null;
}

export function buildPayPalHref(product: ProductView, selectedVariant: ProductVariant | null): string | null {
  const hostedButtonId = getPayPalButton(product, selectedVariant);
  return hostedButtonId ? `https://www.paypal.com/ncp/payment/${hostedButtonId}` : null;
}
