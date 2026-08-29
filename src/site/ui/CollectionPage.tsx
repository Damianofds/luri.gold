import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { assetUrl } from "../assets";
import { getCollectionBySlug, getCollections } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";

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

  return (
    <div>
      <section className="collection-hero">
        <img src={assetUrl(collection.heroImage)} alt={collection.title} />
        <div className="collection-hero__copy">
          <div>
            <p className="eyebrow">{overview ? t(locale, "collectionOverviewEyebrow") : t(locale, "collectionDetailEyebrow")}</p>
            <h1>{collection.title}</h1>
            <p>{collection.description}</p>
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
        <div className="product-grid">
          {collection.products.map((product) => (
            <Link key={product.slug} className="product-card" to={buildLocalizedPath(locale, `/products/${product.slug}`)}>
              <img src={assetUrl(product.images[0]?.path ?? "")} alt={product.title} />
              <div className="product-card__body">
                <h3>{product.title}</h3>
                <p>{product.shortDescription || product.description}</p>
                <span>{product.priceLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
