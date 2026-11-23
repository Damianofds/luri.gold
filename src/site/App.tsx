import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getStructuredData, serializeStructuredData } from "./structuredData";
import { getPageMetadata } from "./seo";
import type { ReactElement } from "react";
import { AppRouter } from "./router";

export function App(): ReactElement {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = getPageMetadata(pathname);
    const structuredData = getStructuredData(pathname);
    const previousData = document.head.querySelector("script[data-structured-data]");
    if (structuredData) {
      const script = previousData ?? document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-structured-data", "");
      script.textContent = serializeStructuredData(structuredData);
      if (!previousData) document.head.append(script);
    } else {
      previousData?.remove();
    }
    document.title = metadata.title;
    document.documentElement.lang = metadata.locale;
    document.head.querySelectorAll("link[data-page-seo]").forEach((link) => link.remove());
    const links = [
      ...(metadata.canonical ? [{ rel: "canonical", url: metadata.canonical }] : []),
      ...metadata.alternates.map(({ language, url }) => ({ rel: "alternate", url, hreflang: language }))
    ];
    for (const attributes of links) {
      const link = document.createElement("link");
      link.dataset.pageSeo = "";
      link.rel = attributes.rel;
      link.href = attributes.url;
      if ("hreflang" in attributes && attributes.hreflang) link.hreflang = attributes.hreflang;
      document.head.append(link);
    }
    const robots = document.head.querySelector('meta[name="robots"][data-page-seo]');
    if (metadata.canonical) {
      robots?.remove();
    } else if (!robots) {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex";
      meta.dataset.pageSeo = "";
      document.head.append(meta);
    }
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  }, [pathname]);
  return <AppRouter />;
}
