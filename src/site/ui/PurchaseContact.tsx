import type { ReactElement } from "react";
import { t } from "../messages";
import type { Locale } from "../types";
import { ContactActions } from "./ContactActions";

export function PurchaseContact({ locale }: { locale: Locale }): ReactElement {
  return (
    <div className="purchase-contact">
      <h2>{t(locale, "productPurchaseContactTitle")}</h2>
      <p>{t(locale, "productPurchaseContactBody")}</p>
      <ContactActions locale={locale} compact />
      <p className="purchase-contact__payments">{t(locale, "productAcceptedPayments")}</p>
    </div>
  );
}
