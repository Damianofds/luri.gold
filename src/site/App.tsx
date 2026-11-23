import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMetadata } from "./seo";
import type { ReactElement } from "react";
import { AppRouter } from "./router";

export function App(): ReactElement {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = getPageMetadata(pathname);
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
