import type { ReactElement } from "react";
import { assetUrl } from "../assets";
import { getCollections, getProducts } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";
import { Link } from "react-router-dom";
import { ProductListing } from "./ProductListing";

export function AllProductsPage({ locale }: { locale: Locale }): ReactElement {
  const products = getProducts(locale);
  const collections = getCollections(locale).filter((collection) => collection.slug !== "frontpage");

  return (
    <div className="collection-page">
      <section className="collection-list-section page-width section-padding">
        <h1>{t(locale, "collectionsTitle")}</h1>
        <div className="collection-grid">
          {collections.map((collection) => (
            <Link key={collection.slug} className="collection-card" to={buildLocalizedPath(locale, `/collections/${collection.slug}`)}>
              <img src={assetUrl(collection.heroImage)} alt={collection.title} />
              <h2>{collection.title}</h2>
            </Link>
          ))}
        </div>
      </section>
      <section className="collection-intro">
        <div className="collection-intro__inner">
          <h2>{t(locale, "allProductsTitle")}</h2>
        </div>
      </section>
      <section className="band collection-band">
        <ProductListing locale={locale} products={products} showCollectionFilter />
      </section>
    </div>
  );
}
