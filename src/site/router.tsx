import { useEffect, type ReactElement } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { siteConfig } from "./config";
import { normalizeLocale } from "./i18n";
import { Layout } from "./ui/Layout";
import { HomePage } from "./ui/HomePage";
import { CollectionPage } from "./ui/CollectionPage";
import { AllProductsPage } from "./ui/AllProductsPage";
import { ProductPage } from "./ui/ProductPage";
import { EditorialPage } from "./ui/EditorialPage";
import { PrivacyPolicyPage } from "./ui/PrivacyPolicyPage";
import { t } from "./messages";
import type { Locale } from "./types";

function LocaleRoutes({ locale }: { locale: Locale }): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Layout locale={locale}><HomePage locale={locale} /></Layout>} />
      <Route path="/collections" element={<Layout locale={locale}><CollectionPage locale={locale} slug="frontpage" overview /></Layout>} />
      <Route path="/collections/all" element={<Layout locale={locale}><AllProductsPage locale={locale} /></Layout>} />
      <Route path="/collections/:slug" element={<Layout locale={locale}><CollectionPage locale={locale} /></Layout>} />
      <Route path="/products/:slug" element={<Layout locale={locale}><ProductPage locale={locale} /></Layout>} />
      <Route path="/pages/:slug" element={<Layout locale={locale}><EditorialPage locale={locale} /></Layout>} />
      <Route path="/privacy-policy" element={<Layout locale={locale}><PrivacyPolicyPage locale={locale} /></Layout>} />
      <Route path="/policies/privacy-policy" element={<AliasRoute locale={locale} target={locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`} />} />
      <Route path="/pages/privacy" element={<AliasRoute locale={locale} target={locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`} />} />
      <Route path="/pages/custom" element={<AliasRoute locale={locale} target={locale === "en" ? "/pages/bespoke" : `/${locale}/pages/bespoke`} />} />
      <Route path="*" element={<AliasRoute locale={locale} target={locale === "en" ? "/" : `/${locale}`} />} />
    </Routes>
  );
}

function LocaleScoped({ locale }: { locale: Locale }): ReactElement {
  return <LocaleRoutes locale={locale} />;
}

export function AppRouter(): ReactElement {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const activeLocale = normalizeLocale(maybeLocale);

  return (
    <Routes>
      <Route path="/de/*" element={<LocaleScoped locale="de" />} />
      <Route path="/it/*" element={<LocaleScoped locale="it" />} />
      <Route path="/*" element={<LocaleScoped locale={activeLocale} />} />
    </Routes>
  );
}

function AliasRoute({ locale, target }: { locale: Locale; target: string }): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(target, { replace: true });
  }, [navigate, target]);

  return (
    <section className="editorial-body">
      <article className="editorial-section">
        <p className="eyebrow">{t(locale, "redirectEyebrow")}</p>
        <h1>{t(locale, "redirectTitle")}</h1>
        <p>
          {t(locale, "redirectBody")} <a href={target}>{target}</a>.
        </p>
      </article>
    </section>
  );
}
