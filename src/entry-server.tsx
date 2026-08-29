import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "./site/App";
import { siteConfig } from "./site/config";

export function render(url: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url} basename={siteConfig.basePath || undefined}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}
