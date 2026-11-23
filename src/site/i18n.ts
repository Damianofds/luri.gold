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

export function unlocalizedPath(pathname: string): string {
  return pathname.replace(/^\/(de|it)(?=\/|$)/, "") || "/";
}

export function buildLocalizedPath(locale: Locale, path: string): string {
  const pathname = path.replace(/^\/+|\/+$/g, "");
  return `${localePrefix(locale)}/${pathname ? `${pathname}/` : ""}`;
}

const languagePreferenceKey = "luri-language";

export function rememberLanguage(locale: Locale): void {
  try {
    window.localStorage.setItem(languagePreferenceKey, locale);
  } catch {
    // Language navigation still works when storage is unavailable.
  }
}

export function getInitialLanguageDestination(): string | null {
  const { pathname, search, hash } = window.location;
  const path = pathname.slice(siteConfig.basePath.length);
  if (path !== unlocalizedPath(path)) {
    return null;
  }

  let preferredLanguage: string | null = null;
  try {
    preferredLanguage = window.localStorage.getItem(languagePreferenceKey);
  } catch {
    // Use the browser language when storage is unavailable.
  }
  const browserLanguage = navigator.language.toLowerCase().split("-")[0];
  const locale = normalizeLocale(preferredLanguage ?? browserLanguage);
  return locale === siteConfig.defaultLocale
    ? null
    : `${siteConfig.basePath}${buildLocalizedPath(locale, path)}${search}${hash}`;
}
