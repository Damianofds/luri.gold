import type { ReactElement, ReactNode } from "react";
import { assetUrl } from "../assets";
import { getPageBySlug } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import type { Locale } from "../types";
import { Link, useParams } from "react-router-dom";
import { ContactActions } from "./ContactActions";

function renderParagraphLinks(
  paragraph: string,
  links: Array<{ label: string; href: string }> | undefined,
  locale: Locale
): ReactNode[] {
  if (!links?.length) {
    return [paragraph];
  }

  const matchingLinks = links
    .map((link) => ({ ...link, index: paragraph.indexOf(link.label) }))
    .filter((link) => link.index >= 0)
    .sort((left, right) => left.index - right.index);
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const link of matchingLinks) {
    nodes.push(paragraph.slice(cursor, link.index));
    nodes.push(<Link key={`${link.href}:${link.index}`} to={buildLocalizedPath(locale, link.href)}>{link.label}</Link>);
    cursor = link.index + link.label.length;
  }
  nodes.push(paragraph.slice(cursor));
  return nodes;
}

export function EditorialPage({ locale }: { locale: Locale }): ReactElement | null {
  const params = useParams();
  const page = getPageBySlug(params.slug ?? "", locale);

  if (!page) {
    return null;
  }

  return (
    <div className={`editorial-page editorial-page--${page.slug}`}>
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
                <p key={paragraph}>{renderParagraphLinks(paragraph, section.links, locale)}</p>
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
          <ContactActions locale={locale} />
        </section>
      ) : null}
    </div>
  );
}
