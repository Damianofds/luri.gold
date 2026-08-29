import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "../assets";
import { getHomePage } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import type { Locale } from "../types";
import { HomeCarousel } from "./HomeCarousel";

export function HomePage({ locale }: { locale: Locale }): ReactElement {
  const home = getHomePage(locale);

  return (
    <div className="home-page">
      <HomeCarousel autoplaySeconds={home.autoplaySeconds} locale={locale} slides={home.slides} />
      {home.sections.map((section, index) => (
        <section
          key={`${section.title}:${index}`}
          className={`home-feature home-feature--media-${section.mediaPosition} home-feature--${section.spacing}`}
        >
          <div className="home-feature__media">
            <img
              src={assetUrl(section.image)}
              alt=""
              loading="lazy"
              style={{ aspectRatio: section.imageAspectRatio }}
            />
          </div>
          <div className="home-feature__copy">
            <h2 className={`heading-${section.headingSize}`}>{section.title}</h2>
            <p>{section.description}</p>
            <Link
              className="button"
              to={buildLocalizedPath(locale, section.href)}
              aria-label={`${section.ctaLabel}: ${section.title}`}
            >
              {section.ctaLabel}
              <span className="visually-hidden">: {section.title}</span>
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
