import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { CardImage } from "./CardImage";
import type { ProductView } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import type { Locale } from "../types";

export function ProductCard({ locale, product }: { locale: Locale; product: ProductView }): ReactElement {
  const primaryImage = product.images[0];
  const hoverImage = product.images[1];

  return (
    <Link className="product-card" to={buildLocalizedPath(locale, `/products/${product.slug}`)}>
      <div className="product-card__media">
        {primaryImage ? <CardImage className="product-card__image" path={primaryImage.path} alt={primaryImage.alt || product.title} /> : null}
        {hoverImage ? <CardImage className="product-card__image product-card__image--hover" path={hoverImage.path} alt="" /> : null}
      </div>
      <div className="product-card__body">
        <h3>{product.title}</h3>
        <span>{product.priceLabel}</span>
      </div>
    </Link>
  );
}
