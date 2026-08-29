# luri.gold

Static React + Vite rebuild of `https://luri.gold` for GitHub Pages.

## Stack

- React 19
- Vite 7
- TypeScript with `strict` enabled
- Static prerendering for product, collection, and editorial routes

## Local development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

The production output is written to `dist/` and includes `CNAME` for `luri.gold`.

## Content source of truth

Editable content lives in `src/content/site/`.

- `home.json`
- `collections/*.json`
- `pages/*.json`
- `products/*.json`
- `paypal-hosted-buttons.json`

Generated aggregate files under `src/content/generated/` are build artifacts.

## Assets

Assets live under `public/site-assets/`.

The public asset host is controlled through:

```bash
VITE_ASSET_BASE_URL=/site-assets
```

That can later be swapped to a CDN URL without changing content JSON.

## Authoring workflows

```bash
npm run new:product -- my-product-slug
npm run new:collection -- my-collection-slug
npm run sync:paypal
npm run validate:content
STRICT_PAYPAL=1 npm run validate:content
```

`npm run validate:content` warns about missing PayPal hosted button IDs by default and fails only when `STRICT_PAYPAL=1`.

## GitHub Pages

The deployment workflow is in `.github/workflows/deploy.yml`.

Repository settings still need these GitHub-side steps:

1. In `Damianofds/luri.gold`, enable GitHub Pages with source `GitHub Actions`.
2. Set the custom domain to `luri.gold`.
3. Point DNS for `luri.gold` to GitHub Pages.
