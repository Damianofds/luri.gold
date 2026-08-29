import type { ReactElement } from "react";
import { assetUrl } from "../assets";
import { getPageBySlug } from "../catalog";
import { siteConfig } from "../config";
import { t } from "../messages";
import type { Locale } from "../types";
import { useParams } from "react-router-dom";

export function EditorialPage({ locale }: { locale: Locale }): ReactElement | null {
  const params = useParams();
  const page = getPageBySlug(params.slug ?? "", locale);

  if (!page) {
    return null;
  }

  return (
    <div className="editorial-page">
      <article className="editorial-body">
        <header className="editorial-page__header">
          <h1>{page.title.replace(/^LURI (?:Jewels|jewels)?\s*-\s*/i, "").replaceAll("&amp;", "&")}</h1>
        </header>
        {page.leadImages?.length ? (
          <div className={`editorial-image-grid editorial-image-grid--${page.leadImages.length}`}>
            {page.leadImages.map((image) => <img key={image} src={assetUrl(image)} alt="" />)}
          </div>
        ) : null}
        {page.sections.map((section, index) => (
          <section key={`${page.slug}:${index}`} className="editorial-section">
            {section.title ? <h2>{section.title}</h2> : null}
            <div className="editorial-section__body">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.image ? <img src={assetUrl(section.image)} alt={section.title || page.title} /> : null}
            {section.images?.length ? (
              <div className={`editorial-image-grid editorial-image-grid--${section.images.length}`}>
                {section.images.map((image) => <img key={image} src={assetUrl(image)} alt="" loading="lazy" />)}
              </div>
            ) : null}
          </section>
        ))}
      </article>
      {page.slug === "contact" ? (
        <section className="band">
          <div className="contact-cta-grid">
            <a className="contact-panel" href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} target="_blank" rel="noreferrer">
              <span>{t(locale, "contactWhatsapp")}</span>
              <strong>{siteConfig.contact.whatsappLabel}</strong>
            </a>
            <a className="contact-panel" href={siteConfig.contact.instagramUrl} target="_blank" rel="noreferrer">
              <span>{t(locale, "contactInstagram")}</span>
              <strong>@{siteConfig.contact.instagramHandle}</strong>
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}
