# Authoring

The editable source of truth is under `src/content/site/`.

Structure:
- `src/content/site/home.json`
- `src/content/site/pages/*.json`
- `src/content/site/collections/*.json`
- `src/content/site/products/*.json`
- `src/content/site/paypal-hosted-buttons.json`

Images live under `public/site-assets/` and the paths in content are relative to the configured asset base URL.
The public asset base can be moved later by changing `VITE_ASSET_BASE_URL`.

Common workflows:

1. Add a product
```bash
npm run new:product -- my-new-product
```
Then:
- fill `src/content/site/products/my-new-product.json`
- add images under `public/site-assets/products/my-new-product/`
- reference the product in one or more collection files
- add a PayPal hosted button mapping in `src/content/site/paypal-hosted-buttons.json`
  or run `npm run sync:paypal` first to seed missing keys

2. Add a collection
```bash
npm run new:collection -- my-new-collection
```
Then:
- fill `src/content/site/collections/my-new-collection.json`
- add `public/site-assets/collections/my-new-collection/cover.jpg`
- list product slugs in `productSlugs`

3. Validate content
```bash
npm run validate:content
```
This reports missing PayPal mappings as warnings by default. To enforce them:
```bash
STRICT_PAYPAL=1 npm run validate:content
```

4. Build generated aggregates
```bash
npm run materialize:content
```

English is required for localized fields. German and Italian can be left empty temporarily and the UI will fall back to English.
