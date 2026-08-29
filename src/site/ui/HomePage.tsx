import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "../assets";
import { getCollections, getHomePage } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";

export function HomePage({ locale }: { locale: Locale }): ReactElement {
  const home = getHomePage(locale);
  const visibleCollections = getCollections(locale).filter((collection) => collection.slug !== "frontpage");

  return (
    <div>
      <section className="hero">
        <img className="hero__image" src={assetUrl(home.hero.image)} alt={home.hero.title} />
        <div className="hero__overlay">
          <div className="hero__box">
            <p className="eyebrow">LURI jewels</p>
            <h1>{home.hero.title}</h1>
            <p>{home.hero.description}</p>
            <div className="hero__actions">
              <Link to={buildLocalizedPath(locale, "/collections/all")} className="button">{t(locale, "heroExplore")}</Link>
              <Link to={buildLocalizedPath(locale, "/pages/bespoke")} className="button button--ghost">{t(locale, "navBespoke")}</Link>
            </div>
          </div>
        </div>
      </section>
      {home.sections.map((section, index) => (
        <section key={`${section.title}:${index}`} className={`home-feature ${index % 2 === 1 ? "home-feature--reverse" : ""}`}>
          <div className="home-feature__media">
            {section.image ? <img src={assetUrl(section.image)} alt={section.title} /> : null}
          </div>
          <div className="home-feature__copy">
            {section.title ? <h2>{section.title}</h2> : null}
            {section.description ? <p>{section.description}</p> : null}
            {section.href && section.ctaLabel ? (
              <Link className="text-link" to={buildLocalizedPath(locale, section.href)}>
                {section.ctaLabel}
              </Link>
            ) : null}
          </div>
        </section>
      ))}
      <section className="band">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">{t(locale, "homeCollectionsEyebrow")}</p>
          <h2>{t(locale, "homeCollectionsTitle")}</h2>
        </div>
        <div className="collection-grid">
          {visibleCollections.map((collection) => (
            <Link key={collection.slug} className="collection-card" to={buildLocalizedPath(locale, `/collections/${collection.slug}`)}>
              <img src={assetUrl(collection.heroImage)} alt={collection.title} />
              <div className="collection-card__body">
                <h3>{collection.title}</h3>
                {collection.description ? <p>{collection.description}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
