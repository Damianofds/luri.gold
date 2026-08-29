import type { PropsWithChildren, ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { collections, pages } from "../../content/loaders";
import { assetUrl } from "../assets";
import { siteConfig } from "../config";
import { buildLocalizedPath, localePrefix, localizeValue } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";

export function Layout({ locale, children }: PropsWithChildren<{ locale: Locale }>): ReactElement {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__topline">
            <nav className="site-nav site-nav--left" aria-label="Primary">
              <Link to={buildLocalizedPath(locale, "/collections/all")}>{t(locale, "navCollection")}</Link>
              <Link to={buildLocalizedPath(locale, "/pages/about")}>{t(locale, "navAbout")}</Link>
              <Link to={buildLocalizedPath(locale, "/pages/bespoke")}>{t(locale, "navBespoke")}</Link>
              <Link to={buildLocalizedPath(locale, "/pages/heirloom-transformation")}>{t(locale, "navHeirloom")}</Link>
            </nav>
            <Link className="site-brand" to={locale === siteConfig.defaultLocale ? "/" : localePrefix(locale)}>
              <img src={assetUrl("brand/logo-wordmark.png")} alt="LURI jewels" />
            </Link>
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="site-footer__grid">
          <div>
            <h2>{t(locale, "footerDiscover")}</h2>
            <ul>
              <li><Link to={buildLocalizedPath(locale, "/collections/all")}>{t(locale, "footerAllProducts")}</Link></li>
              {collections.filter((collection) => collection.slug !== "frontpage").map((collection) => (
                <li key={collection.slug}>
                  <Link to={buildLocalizedPath(locale, `/collections/${collection.slug}`)}>
                    {localizeValue(collection.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t(locale, "footerPages")}</h2>
            <ul>
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link to={buildLocalizedPath(locale, `/pages/${page.slug}`)}>
                    {localizeValue(page.title, locale)}
                  </Link>
                </li>
              ))}
              <li><Link to={buildLocalizedPath(locale, "/privacy-policy")}>{t(locale, "footerPrivacy")}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t(locale, "footerContact")}</h2>
            <ul>
              <li><a href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} target="_blank" rel="noreferrer">{t(locale, "contactWhatsapp")}</a></li>
              <li><a href={siteConfig.contact.instagramUrl} target="_blank" rel="noreferrer">{t(locale, "contactInstagram")}</a></li>
              <li><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
            </ul>
          </div>
          <div>
            <h2>{t(locale, "footerPayment")}</h2>
            <p>PayPal</p>
            <p>{t(locale, "footerEuroOnly")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LocaleSwitcher({ locale }: { locale: Locale }): ReactElement {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/^\/(de|it)(?=\/|$)/, "") || "/";

  return (
    <nav className="site-nav site-nav--right" aria-label="Language">
      {siteConfig.locales.map((entry) => (
        <Link
          key={entry}
          className={entry === locale ? "is-active" : ""}
          to={entry === "en" ? normalizedPath : `${localePrefix(entry)}${normalizedPath === "/" ? "" : normalizedPath}`}
        >
          {entry.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
