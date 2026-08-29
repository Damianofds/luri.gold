import type { ReactElement } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assetUrl } from "../assets";
import { getProductBySlug, getRelatedProducts, type ProductView } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import { buildPayPalHref } from "../paypal";
import type { Locale, ProductVariant } from "../types";

function findVariant(product: ProductView | null, variantId: number | null): ProductVariant | null {
  if (!product) {
    return null;
  }
  return product.variants.find((variant) => variant.id === variantId) ?? product.variants[0] ?? null;
}

export function ProductPage({ locale }: { locale: Locale }): ReactElement | null {
  const params = useParams();
  const product = getProductBySlug(params.slug ?? "", locale);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(product?.variants[0]?.id ?? null);

  if (!product) {
    return null;
  }

  const selectedVariant = findVariant(product, selectedVariantId);
  const relatedProducts = getRelatedProducts(product, locale);

  return (
    <div className="product-page">
      <section className="product-layout">
        <div className="product-gallery">
          {product.images.map((image) => (
            <img key={image.path} src={assetUrl(image.path)} alt={image.alt || product.title} />
          ))}
        </div>
        <div className="product-summary">
          <p className="eyebrow">{product.collectionLabel}</p>
          <h1>{product.title}</h1>
          <p className="product-price">{selectedVariant?.priceLabel ?? product.priceLabel}</p>
          <p className="product-description">{product.description}</p>
          {product.longDescription.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {product.options.map((option) => (
            <label key={option.name} className="variant-field">
              <span>{product.optionLabels[option.name] ?? option.name}</span>
              <select
                value={selectedVariant?.selectedOptions[option.name] ?? option.values[0]}
                onChange={(event) => {
                  const nextSelection = {
                    ...(selectedVariant?.selectedOptions ?? {}),
                    [option.name]: event.target.value
                  };
                  const nextVariant = product.variants.find((variant) =>
                    Object.entries(nextSelection).every(([name, value]) => variant.selectedOptions[name] === value)
                  );
                  if (nextVariant) {
                    setSelectedVariantId(nextVariant.id);
                  }
                }}
              >
                {option.values.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          ))}
          <a
            className={`button button--paypal ${buildPayPalHref(product, selectedVariant) ? "" : "is-disabled"}`}
            href={buildPayPalHref(product, selectedVariant) ?? "#"}
            target="_blank"
            rel="noreferrer"
          >
            {product.purchaseLabel}
          </a>
          <div className="product-meta">
            <p>{product.shippingNote}</p>
            <p>{product.materialNote}</p>
          </div>
          <div className="contact-strip">
            <a href={product.whatsappUrl} target="_blank" rel="noreferrer">{t(locale, "contactWhatsapp")}</a>
            <a href={product.instagramUrl} target="_blank" rel="noreferrer">{t(locale, "contactInstagram")}</a>
          </div>
        </div>
      </section>
      <section className="band">
        <div className="section-heading">
          <p className="eyebrow">{t(locale, "productRelatedEyebrow")}</p>
          <h2>{t(locale, "productRelatedTitle")}</h2>
        </div>
        <div className="product-grid">
          {relatedProducts.map((entry) => (
            <Link key={entry.slug} className="product-card" to={buildLocalizedPath(locale, `/products/${entry.slug}`)}>
              <img src={assetUrl(entry.images[0]?.path ?? "")} alt={entry.title} />
              <div className="product-card__body">
                <h3>{entry.title}</h3>
                <span>{entry.priceLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
