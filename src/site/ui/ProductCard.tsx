import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "../assets";
import type { ProductView } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import type { Locale } from "../types";

export function ProductCard({ locale, product }: { locale: Locale; product: ProductView }): ReactElement {
  const primaryImage = product.images[0];
  const hoverImage = product.images[1];

  return (
    <Link className="product-card" to={buildLocalizedPath(locale, `/products/${product.slug}`)}>
      <div className="product-card__media">
        {primaryImage ? <img className="product-card__image" src={assetUrl(primaryImage.path)} alt={primaryImage.alt || product.title} /> : null}
        {hoverImage ? <img className="product-card__image product-card__image--hover" src={assetUrl(hoverImage.path)} alt="" loading="lazy" /> : null}
      </div>
      <div className="product-card__body">
        <h3>{product.title}</h3>
        <span>{product.priceLabel}</span>
      </div>
    </Link>
  );
}
