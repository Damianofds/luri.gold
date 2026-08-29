import { useRef, useState, type ReactElement, type UIEvent } from "react";
import { useParams } from "react-router-dom";
import { assetUrl } from "../assets";
import { getProductBySlug, getRelatedProducts, type ProductView } from "../catalog";
import { t } from "../messages";
import { buildPayPalHref } from "../paypal";
import type { Locale, ProductVariant } from "../types";
import { ProductCard } from "./ProductCard";

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
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(product?.images[0]?.path ?? null);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return null;
  }

  const productImages = product.images;
  const selectedVariant = findVariant(product, selectedVariantId);
  const relatedProducts = getRelatedProducts(product, locale);
  const normalizedDescription = product.description.replace(/\s+/g, " ").trim();
  const longDescription = product.longDescription.filter(
    (paragraph, index, paragraphs) => paragraph.replace(/\s+/g, " ").trim() !== normalizedDescription
      && paragraphs.indexOf(paragraph) === index
  );

  function moveMobileGallery(index: number): void {
    const normalizedIndex = Math.max(0, Math.min(productImages.length - 1, index));
    setMobileImageIndex(normalizedIndex);
    mobileGalleryRef.current?.scrollTo({
      left: normalizedIndex * mobileGalleryRef.current.clientWidth,
      behavior: "smooth"
    });
  }

  function handleMobileScroll(event: UIEvent<HTMLDivElement>): void {
    const element = event.currentTarget;
    const index = Math.round(element.scrollLeft / Math.max(1, element.clientWidth));
    setMobileImageIndex(Math.max(0, Math.min(productImages.length - 1, index)));
  }

  return (
    <div className="product-page">
      <section className="product-layout">
        <div className="product-gallery">
          <div className="product-gallery__desktop">
            <div className="product-gallery__main">
              <img
                className="product-gallery__main-image"
                src={assetUrl(selectedImagePath ?? product.images[0]?.path ?? "")}
                alt={product.title}
              />
            </div>
            {product.images.length > 1 ? (
              <div className="thumbnail-strip" aria-label={t(locale, "productImages")}>
                {product.images.map((image, index) => (
                  <button
                    key={image.path}
                    type="button"
                    className={`thumbnail-button ${selectedImagePath === image.path ? "is-active" : ""}`}
                    onClick={() => {
                      setSelectedImagePath(image.path);
                      setMobileImageIndex(index);
                    }}
                  >
                    <img src={assetUrl(image.path)} alt={image.alt || `${product.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="product-gallery__mobile">
            <div ref={mobileGalleryRef} className="product-gallery__mobile-track" onScroll={handleMobileScroll}>
              {product.images.map((image, index) => (
                <img
                  key={image.path}
                  src={assetUrl(image.path)}
                  alt={image.alt || `${product.title} ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>
            {product.images.length > 1 ? (
              <div className="product-gallery__mobile-controls">
                <button className="icon-button" type="button" onClick={() => moveMobileGallery(mobileImageIndex - 1)} aria-label={t(locale, "productImagePrevious")}>‹</button>
                <span>{mobileImageIndex + 1} / {product.images.length}</span>
                <button className="icon-button" type="button" onClick={() => moveMobileGallery(mobileImageIndex + 1)} aria-label={t(locale, "productImageNext")}>›</button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="product-summary">
          <h1>{product.title}</h1>
          <div className="product-summary__section product-summary__description">
            <p className="product-description">{product.description}</p>
            {longDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="product-price-block">
            <p className="product-price">{selectedVariant?.priceLabel ?? product.priceLabel}</p>
            <p className="product-tax">{t(locale, "productTaxes")}</p>
          </div>
          <div className="product-summary__section product-summary__section--purchase">
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
                  {option.values.map((value) => <option key={value} value={value}>{value}</option>)}
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
          </div>
          <div className="product-meta product-summary__section">
            <p>{product.shippingNote}</p>
            {product.materialNote ? <p>{product.materialNote}</p> : null}
          </div>
          <div className="contact-strip">
            <a href={product.whatsappUrl} target="_blank" rel="noreferrer">{t(locale, "contactWhatsapp")}</a>
            <a href={product.instagramUrl} target="_blank" rel="noreferrer">{t(locale, "contactInstagram")}</a>
          </div>
        </div>
      </section>
      {relatedProducts.length > 0 ? (
        <section className="band related-products">
          <div className="section-heading">
            <h2>{t(locale, "productRelatedTitle")}</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((entry) => <ProductCard key={entry.slug} locale={locale} product={entry} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
