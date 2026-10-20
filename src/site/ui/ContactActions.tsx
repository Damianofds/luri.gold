import type { ReactElement } from "react";
import { siteConfig } from "../config";
import { t } from "../messages";
import type { Locale } from "../types";

export function ContactActions({ locale, compact = false }: { locale: Locale; compact?: boolean }): ReactElement {
  return (
    <div className={`contact-cta-grid ${compact ? "contact-cta-grid--compact" : ""}`}>
      <a className="contact-panel" href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} target="_blank" rel="noreferrer">
        <span className="contact-panel__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7c1.7.9 3.5 1.4 5.4 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4Zm-8.4 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.3A9.8 9.8 0 0 1 12.1 2c2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9 9.8 9.8 0 0 1-9.8 9.9Zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 3 1.3 3.2c.1.2 2.2 3.4 5.4 4.7.7.3 1.3.5 1.8.6.8.2 1.4.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" /></svg>
        </span>
        <span className="contact-panel__copy">
          <span>{t(locale, "contactWhatsapp")}</span>
          <strong>{t(locale, "contactWhatsappAction")}</strong>
          {!compact ? <small>{t(locale, "contactWhatsappPrompt")}</small> : null}
        </span>
      </a>
      <a className="contact-panel" href={`mailto:${siteConfig.contact.email}`}>
        <span className="contact-panel__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm10 9L2.4 6H2v.5l10 7.3 10-7.3V6h-.4L12 13Zm0 3.3L2 9v9h20V9l-10 7.3Z" /></svg>
        </span>
        <span className="contact-panel__copy">
          <span>{t(locale, "contactEmail")}</span>
          <strong>{t(locale, "contactEmailAction")}</strong>
          {!compact ? <small>{t(locale, "contactEmailPrompt")}</small> : null}
        </span>
      </a>
    </div>
  );
}
