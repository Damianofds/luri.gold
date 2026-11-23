import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./site/App";
import { siteConfig } from "./site/config";
import { getInitialLanguageDestination } from "./site/i18n";
import "./styles.css";

const destination = getInitialLanguageDestination();
if (destination) {
  window.location.replace(destination);
} else {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter basename={siteConfig.basePath || undefined}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
