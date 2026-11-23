import { useEffect, useRef, useState, type ReactElement, type UIEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { assetUrl } from "../assets";
import { getProductBreadcrumbs, getProductBySlug, getRelatedProducts, type ProductView } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import { cleanText } from "../seo";
import type { Locale } from "../types";
import { ProductCard } from "./ProductCard";
import { ProductPrice } from "./ProductPrice";
import { PurchaseContact } from "./PurchaseContact";

export function ProductPage({ locale }: { locale: Locale }): ReactElement | null {
  const params = useParams();
  const slug = params.slug ?? "";
  return <ProductPageContent key={slug} locale={locale} slug={slug} />;
}

function ProductPageContent({ locale, slug }: { locale: Locale; slug: string }): ReactElement | null {
  const product = getProductBySlug(slug, locale);
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(product?.images[0]?.path ?? null);
  const [openImagePath, setOpenImagePath] = useState<string | null>(null);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openImagePath) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpenImagePath(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [openImagePath]);

  if (!product) {
    return null;
  }

  const breadcrumbs = getProductBreadcrumbs(product);
  const productImages = product.images;
  const relatedProducts = getRelatedProducts(product, locale);
  const description = cleanText(product.description);
  const longDescription = [...new Set(product.longDescription.map(cleanText).filter(Boolean))];
  // The Shopify import sometimes used a shortened copy of the body as the summary.
  const paragraphs = !description || longDescription.some((paragraph) => paragraph.startsWith(description))
    ? longDescription
    : [description, ...longDescription];

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
      <nav className="product-breadcrumbs page-width" aria-label={t(locale, "productBreadcrumbs")}>
        <ol>
          {breadcrumbs.slice(0, -1).map(({ label, path }) => (
            <li key={path}><Link to={buildLocalizedPath(locale, path)}>{label}</Link> <span aria-hidden="true">›</span></li>
          ))}
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>
      <section className="product-layout">
        <div className="product-gallery">
          <div className="product-gallery__desktop">
            <div className="product-gallery__main">
              <button
                className="product-gallery__open"
                type="button"
                aria-label={t(locale, "productImageOpen")}
                onClick={() => setOpenImagePath(selectedImagePath ?? product.images[0]?.path ?? null)}
              >
                <img
                  className="product-gallery__main-image"
                  src={assetUrl(selectedImagePath ?? product.images[0]?.path ?? "")}
                  alt={product.title}
                />
              </button>
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
                <button
                  key={image.path}
                  className="product-gallery__mobile-slide"
                  type="button"
                  aria-label={`${t(locale, "productImageOpen")}: ${index + 1}`}
                  onClick={() => setOpenImagePath(image.path)}
                >
                  <img
                    src={assetUrl(image.path)}
                    alt={image.alt || `${product.title} ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </button>
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
            {paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "product-description" : undefined}>{paragraph}</p>
            ))}
          </div>
          <ProductPrice key={product.slug} locale={locale} product={product} />
          <div className="product-summary__section product-summary__section--purchase">
            <PurchaseContact locale={locale} />
          </div>
          <div className="product-meta product-summary__section">
            <p>{product.shippingNote}</p>
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
      {openImagePath ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={product.title} onClick={() => setOpenImagePath(null)}>
          <button className="image-lightbox__close" type="button" aria-label={t(locale, "productImageClose")} onClick={() => setOpenImagePath(null)}>×</button>
          <img src={assetUrl(openImagePath)} alt={product.title} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </div>
  );
}
