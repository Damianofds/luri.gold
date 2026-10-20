import { useState, type ReactElement } from "react";
import type { ProductView } from "../catalog";
import { t } from "../messages";
import type { Locale } from "../types";

function getPriceOptionName(product: ProductView): string | null {
  if (product.slug === "classic-wedding-ring") {
    return "Alloy";
  }

  if (product.slug === "paperclip-chain") {
    return "Length";
  }

  const isZodiacCharm = product.collectionSlugs.includes("frontpage")
    && product.options.some((option) => option.name === "Gold/Silver");
  return isZodiacCharm ? "Gold/Silver" : null;
}

export function ProductPrice({ locale, product }: { locale: Locale; product: ProductView }): ReactElement {
  const optionName = getPriceOptionName(product);
  const option = product.options.find((entry) => entry.name === optionName) ?? null;
  const [selectedValue, setSelectedValue] = useState(option?.values[0] ?? "");
  const selectedVariant = option
    ? product.variants.find((variant) => variant.selectedOptions[option.name] === selectedValue)
    : null;

  return (
    <div className="product-price-block">
      {option ? (
        <label className="product-price-option">
          <span>{product.optionLabels[option.name] ?? option.name}</span>
          <select value={selectedValue} onChange={(event) => setSelectedValue(event.target.value)}>
            {option.values.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      ) : null}
      <p className="product-price">{selectedVariant?.priceLabel ?? product.priceLabel}</p>
      <p className="product-tax">{t(locale, "productTaxes")}</p>
    </div>
  );
}
