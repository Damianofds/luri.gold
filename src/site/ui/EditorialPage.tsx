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
    <div>
      <section className="editorial-hero">
        <img src={assetUrl(page.heroImage)} alt={page.title} />
        <div className="editorial-hero__copy">
          <div>
            <p className="eyebrow">LURI jewels</p>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
          </div>
        </div>
      </section>
      <section className="editorial-body">
        {page.sections.map((section, index) => (
          <article key={`${page.slug}:${index}`} className="editorial-section">
            {section.title ? <h2>{section.title}</h2> : null}
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.image ? <img src={assetUrl(section.image)} alt={section.title || page.title} /> : null}
          </article>
        ))}
      </section>
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
