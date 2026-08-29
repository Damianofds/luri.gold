import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "../assets";
import type { HomePageView } from "../catalog";
import { buildLocalizedPath } from "../i18n";
import { t } from "../messages";
import type { Locale } from "../types";

interface HomeCarouselProps {
  autoplaySeconds: number;
  locale: Locale;
  slides: HomePageView["slides"];
}

export function HomeCarousel({ autoplaySeconds, locale, slides }: HomeCarouselProps): ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, autoplaySeconds * 1000);

    return () => window.clearInterval(timer);
  }, [autoplaySeconds, paused, slides.length]);

  function move(direction: -1 | 1): void {
    setActiveIndex((index) => (index + direction + slides.length) % slides.length);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
    pointerStartX.current = event.clientX;
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>): void {
    if (pointerStartX.current === null) {
      return;
    }
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) > 45) {
      move(distance > 0 ? -1 : 1);
    }
  }

  return (
    <section className="home-carousel" aria-label={t(locale, "carouselLabel")} aria-roledescription="carousel">
      <div
        className="home-carousel__viewport"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="home-carousel__track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {slides.map((slide, index) => (
            <article
              key={`${slide.image}:${index}`}
              className="home-carousel__slide"
              aria-hidden={index !== activeIndex}
              aria-label={`${index + 1} / ${slides.length}`}
              aria-roledescription="slide"
            >
              <div className="home-carousel__media">
                <img
                  src={assetUrl(slide.image)}
                  alt=""
                  loading={index === 0 ? "eager" : "lazy"}
                  style={{ objectPosition: slide.imagePosition }}
                />
              </div>
              <div className="home-carousel__content">
                <div className="home-carousel__caption">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <Link className="button" to={buildLocalizedPath(locale, slide.href)} tabIndex={index === activeIndex ? 0 : -1}>
                    {slide.ctaLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="home-carousel__controls">
        <button type="button" className="icon-button" onClick={() => move(-1)} aria-label={t(locale, "carouselPrevious")}>
          <span aria-hidden="true">‹</span>
        </button>
        <div className="home-carousel__dots">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              className={`carousel-dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${t(locale, "carouselGoTo")} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" className="icon-button" onClick={() => move(1)} aria-label={t(locale, "carouselNext")}>
          <span aria-hidden="true">›</span>
        </button>
        <button
          type="button"
          className="icon-button home-carousel__autoplay"
          onClick={() => setPaused((value) => !value)}
          aria-label={t(locale, paused ? "carouselPlay" : "carouselPause")}
        >
          <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
    </section>
  );
}
