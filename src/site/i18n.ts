import { siteConfig } from "./config";
import type { Locale, LocalizedString } from "./types";

export function normalizeLocale(locale?: string): Locale {
  return siteConfig.locales.includes(locale as Locale) ? (locale as Locale) : siteConfig.defaultLocale;
}

export function localePrefix(locale: Locale): string {
  return locale === siteConfig.defaultLocale ? "" : `/${locale}`;
}

export function localizeValue(value: LocalizedString | undefined, locale: Locale): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value) {
    return "";
  }

  return value[locale] ?? value[siteConfig.defaultLocale] ?? "";
}

export function buildLocalizedPath(locale: Locale, path: string): string {
  const prefix = localePrefix(locale);
  if (!path.startsWith("/")) {
    return `${prefix}/${path}`;
  }
  return `${prefix}${path}` || "/";
}
