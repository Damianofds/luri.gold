import { useEffect, useState, type PropsWithChildren, type ReactElement } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assetUrl } from "../assets";
import { siteConfig } from "../config";
import { buildLocalizedPath, localePrefix } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";

export function Layout({ locale, children }: PropsWithChildren<{ locale: Locale }>): ReactElement {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__topline">
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-primary-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="visually-hidden">{menuOpen ? t(locale, "navClose") : t(locale, "navMenu")}</span>
              <span className={`menu-toggle__icon ${menuOpen ? "is-open" : ""}`} aria-hidden="true" />
            </button>
            <Link className="site-brand" to={locale === siteConfig.defaultLocale ? "/" : localePrefix(locale)}>
              <img src={assetUrl("brand/logo-wordmark.png")} alt="LURI jewels" />
            </Link>
            <LocaleSwitcher locale={locale} />
            <nav id="site-primary-nav" className={`site-nav site-nav--primary ${menuOpen ? "is-open" : ""}`} aria-label="Primary">
              <NavLink end to={buildLocalizedPath(locale, "/")} className={({ isActive }) => (isActive ? "is-active" : "")}>{t(locale, "navHome")}</NavLink>
              <NavLink to={buildLocalizedPath(locale, "/collections/all")} className={({ isActive }) => (isActive ? "is-active" : "")}>{t(locale, "navCollection")}</NavLink>
              <NavLink to={buildLocalizedPath(locale, "/pages/about")} className={({ isActive }) => (isActive ? "is-active" : "")}>{t(locale, "navAbout")}</NavLink>
              <NavLink to={buildLocalizedPath(locale, "/pages/bespoke")} className={({ isActive }) => (isActive ? "is-active" : "")}>{t(locale, "navBespoke")}</NavLink>
              <NavLink to={buildLocalizedPath(locale, "/pages/heirloom-transformation")} className={({ isActive }) => (isActive ? "is-active" : "")}>{t(locale, "navHeirloom")}</NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__block">
            <ul>
              <li><Link to={buildLocalizedPath(locale, "/collections/all")}>{t(locale, "navCollection")}</Link></li>
              <li><Link to={buildLocalizedPath(locale, "/pages/contact")}>{t(locale, "footerContact")}</Link></li>
              <li><Link to={buildLocalizedPath(locale, "/privacy-policy")}>{t(locale, "footerPrivacy")}</Link></li>
              <li><Link to={buildLocalizedPath(locale, "/pages/payment-shipping")}>{t(locale, "footerShipping")}</Link></li>
            </ul>
          </div>
          <div className="site-footer__block">
            <ul>
              <li><a href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} target="_blank" rel="noreferrer">{t(locale, "contactWhatsapp")}</a></li>
              <li><a href={siteConfig.contact.instagramUrl} target="_blank" rel="noreferrer">{t(locale, "contactInstagram")}</a></li>
              <li><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
            </ul>
          </div>
          <div className="site-footer__localization"><LocaleSwitcher locale={locale} /></div>
          <div className="site-footer__payment"><span>{t(locale, "footerPayment")}</span><strong>PayPal</strong><small>{t(locale, "footerEuroOnly")}</small></div>
          <small className="site-footer__copyright">© 2026, LURI jewels</small>
        </div>
      </footer>
    </div>
  );
}

function LocaleSwitcher({ locale }: { locale: Locale }): ReactElement {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/^\/(de|it)(?=\/|$)/, "") || "/";

  return (
    <nav className="site-nav site-nav--language" aria-label="Language">
      {siteConfig.locales.map((entry) => (
        <NavLink
          key={entry}
          className={({ isActive }) => (entry === locale || isActive ? "is-active" : "")}
          to={entry === "en" ? normalizedPath : `${localePrefix(entry)}${normalizedPath === "/" ? "" : normalizedPath}`}
        >
          {entry.toUpperCase()}
        </NavLink>
      ))}
    </nav>
  );
}
