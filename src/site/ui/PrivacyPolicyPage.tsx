import type { ReactElement } from "react";
import { siteConfig } from "../config";
import { t } from "../messages";
import type { Locale } from "../types";

export function PrivacyPolicyPage({ locale }: { locale: Locale }): ReactElement {
  return (
    <section className="editorial-body">
      <article className="editorial-section">
        <p className="eyebrow">{t(locale, "privacyEyebrow")}</p>
        <h1>{t(locale, "privacyTitle")}</h1>
        <p>
          {t(locale, "privacyBodyOne")}
        </p>
        <p>
          {t(locale, "privacyBodyTwo")}
        </p>
        <p>
          {t(locale, "privacyBodyThree")} <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        </p>
      </article>
    </section>
  );
}
