import { useMemo, useState, type ReactElement } from "react";
import type { ProductView } from "../catalog";
import { t } from "../messages";
import type { Locale } from "../types";
import { ProductCard } from "./ProductCard";

type SortKey = "featured" | "title-asc" | "title-desc" | "price-asc" | "price-desc";

function productPrice(product: ProductView): number {
  const prices = product.variants.map((variant) => Number.parseFloat(variant.price)).filter(Number.isFinite);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

export function ProductListing({
  locale,
  products,
  showCollectionFilter = false
}: {
  locale: Locale;
  products: ProductView[];
  showCollectionFilter?: boolean;
}): ReactElement {
  const [sort, setSort] = useState<SortKey>("featured");
  const [collection, setCollection] = useState("all");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");

  const collectionOptions = useMemo(
    () => [...new Set(products.flatMap((product) => product.collectionSlugs))].sort(),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const minimum = Number.parseFloat(minimumPrice);
    const maximum = Number.parseFloat(maximumPrice);
    const filtered = products.filter((product) => {
      const price = productPrice(product);
      return (collection === "all" || product.collectionSlugs.includes(collection))
        && (!Number.isFinite(minimum) || price >= minimum)
        && (!Number.isFinite(maximum) || price <= maximum);
    });

    if (sort === "featured") {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      if (sort === "title-asc" || sort === "title-desc") {
        const result = left.title.localeCompare(right.title, locale);
        return sort === "title-asc" ? result : -result;
      }
      const result = productPrice(left) - productPrice(right);
      return sort === "price-asc" ? result : -result;
    });
  }, [collection, locale, maximumPrice, minimumPrice, products, sort]);

  return (
    <div className="product-listing">
      <div className="catalog-toolbar">
        <div className="catalog-toolbar__filters">
          {showCollectionFilter ? (
            <label>
              <span>{t(locale, "filterCollection")}</span>
              <select value={collection} onChange={(event) => setCollection(event.target.value)}>
                <option value="all">{t(locale, "filterAll")}</option>
                {collectionOptions.map((option) => <option key={option} value={option}>{option.replaceAll("-", " ")}</option>)}
              </select>
            </label>
          ) : null}
          <label className="price-filter">
            <span>{t(locale, "filterMinPrice")}</span>
            <input inputMode="decimal" type="number" min="0" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} placeholder="€" />
          </label>
          <label className="price-filter">
            <span>{t(locale, "filterMaxPrice")}</span>
            <input inputMode="decimal" type="number" min="0" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} placeholder="€" />
          </label>
        </div>
        <div className="catalog-toolbar__sort">
          <label>
            <span>{t(locale, "sortBy")}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              <option value="featured">{t(locale, "sortFeatured")}</option>
              <option value="title-asc">{t(locale, "sortTitleAsc")}</option>
              <option value="title-desc">{t(locale, "sortTitleDesc")}</option>
              <option value="price-asc">{t(locale, "sortPriceAsc")}</option>
              <option value="price-desc">{t(locale, "sortPriceDesc")}</option>
            </select>
          </label>
          <span className="catalog-toolbar__count">{visibleProducts.length} {t(locale, "productsCount")}</span>
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard key={product.slug} locale={locale} product={product} />)}
      </div>
    </div>
  );
}
