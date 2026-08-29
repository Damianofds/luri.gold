import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { assetUrl } from "../assets";
import { getCollectionBySlug, getCollections } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";
import { ProductListing } from "./ProductListing";

export function CollectionPage({
  locale,
  slug: forcedSlug,
  overview = false
}: {
  locale: Locale;
  slug?: string;
  overview?: boolean;
}): ReactElement | null {
  const params = useParams();
  const slug = forcedSlug ?? params.slug ?? "frontpage";
  const collection = getCollectionBySlug(slug, locale);
  const allCollections = getCollections(locale).filter((entry) => entry.slug !== "frontpage");

  if (!collection) {
    return null;
  }

  const heroTitle = overview ? t(locale, "collectionsTitle") : collection.title;
  const heroDescription = overview ? t(locale, "collectionsDescription") : collection.description;

  return (
    <div>
      <section className={`collection-hero ${overview ? "collection-hero--overview" : "collection-hero--detail"}`}>
        <div className="collection-hero__copy">
          <div>
            <h1>{heroTitle}</h1>
            {heroDescription ? <p>{heroDescription}</p> : null}
          </div>
        </div>
      </section>
      {overview ? (
        <section className="band">
          <div className="collection-grid">
            {allCollections.map((entry) => (
              <Link key={entry.slug} className="collection-card" to={buildLocalizedPath(locale, `/collections/${entry.slug}`)}>
                <img src={assetUrl(entry.heroImage)} alt={entry.title} />
                <div className="collection-card__body">
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="band">
        <ProductListing locale={locale} products={collection.products} />
      </section>
    </div>
  );
}
