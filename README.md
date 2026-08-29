# luri.gold

Static React + Vite rebuild of `https://luri.gold`, designed for GitHub Pages.

## Stack

- React 19
- Vite 7
- TypeScript with `strict` enabled
- Static prerendering for product, collection, and editorial routes
- English, German, and Italian content with English fallback
- Locally hosted assets with a configurable CDN base URL

## Prerequisites

- Node.js 24.x
- npm 11.x or the npm version bundled with Node.js 24

No database or server runtime is required.

## Local development

```bash
npm ci
npm run validate:content
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173/`. Changes to React,
TypeScript, CSS, content JSON, and public assets are reflected automatically.

To override the public asset location, create `.env.local`:

```bash
VITE_ASSET_BASE_URL=/site-assets
```

## Build

```bash
npm run build
npm run preview
```

The build performs strict TypeScript checking, creates the Vite client bundle,
prerenders every supported route, and adds the files required by GitHub Pages.
The deployable output is written to `dist/` and includes:

- Minified and gzip-compressible HTML, CSS, and JavaScript
- Prerendered English, German, and Italian routes
- `site-assets/` with the complete image and font hierarchy
- `.nojekyll`, `robots.txt`, and `llms.txt`

## Content source of truth

Editable content lives in `src/content/site/`.

- `home.json`
- `collections/*.json`
- `pages/*.json`
- `products/*.json`
- `paypal-hosted-buttons.json`

Generated aggregate files under `src/content/generated/` are build artifacts.
Run `npm run materialize:content` to regenerate them without creating a full
production build.

## Assets

Assets live under `public/site-assets/`.

The public asset host is controlled through:

```bash
VITE_ASSET_BASE_URL=/site-assets
```

That can later be swapped to an absolute CDN URL without changing content JSON.

## Authoring workflows

```bash
npm run new:product -- my-product-slug
npm run new:collection -- my-collection-slug
npm run sync:paypal
npm run validate:content
STRICT_PAYPAL=1 npm run validate:content
```

`npm run validate:content` warns about missing PayPal hosted button IDs by default and fails only when `STRICT_PAYPAL=1`.

See `AUTHORING.md` for the product and collection JSON schemas and the expected
asset directory layout.

## PayPal configuration

The site uses one hosted PayPal button per product or variant. Add hosted button
IDs to `src/content/site/paypal-hosted-buttons.json`, then run:

```bash
npm run sync:paypal
STRICT_PAYPAL=1 npm run validate:content
```

Until a mapping is present, the corresponding purchase button remains disabled.

## Useful checks

```bash
npm run typecheck
npm run validate:content
npm run build
```

## GitHub Pages

The deployment workflow is in `.github/workflows/deploy.yml`. A push to `main`
builds and publishes `dist/` through GitHub Pages. The repository also keeps a
fully rendered `gh-pages` branch for direct Pages hosting.

Repository settings still need these GitHub-side steps:

1. In `Damianofds/luri.gold`, enable GitHub Pages with source `GitHub Actions`.
2. Set a custom domain only when you are ready to switch away from the default
   `damianofds.github.io/luri.gold` URL.
