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
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  }, [pathname]);
  return <AppRouter />;
}
