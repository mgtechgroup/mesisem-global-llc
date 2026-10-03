# Mesisem Public Resources

A searchable public reference library for Mesisem Global LLC. It contains curated, original summaries and outbound source links—not private business records or wholesale copies of publisher websites.

Temporary public site: **https://mesisem-public-resources.pages.dev**. This is not the final product domain.

Every release must use [TODO.md](TODO.md) for development, final deployment confirmation, further work and maintenance, and record publish results in [PUBLISH_LOG.md](PUBLISH_LOG.md). Confirm the final steps with the project owner before deploying.

## Scope

- Search, categories, review labels, type filters and resource details.
- Versioned JSON catalog with provenance, review dates and reuse notes.
- CSV export and independently readable HTML for every published record.
- Transparent collection methodology and company-claim distinctions.
- No accounts, admin portal, payments, private database or unrestricted scraping endpoint.

The initial catalog contains 17 records: eight external primary-source resources, eight company-provided repository references and one unavailable website observation. The company website returned a temporarily paused deployment during collection on 2026-10-02. Repository-based descriptions are **self-reported**; they do not verify company registration, service delivery, certifications or security.

## Run this standalone repository

Requires Node.js 22+ and pnpm 10.26.1.

```sh
pnpm install
pnpm dev
pnpm validate:catalog
pnpm typecheck
pnpm build
pnpm preview
```

Defaults: port 3000 and root base path. Set PORT and BASE_PATH for your host if needed. Serve `dist/public` after building. No runtime API, database, authentication connection or secrets are needed.

This repository contains only the Mesisem resource project. Its standalone packaging does not depend on neighboring Replit workspace libraries.

## SEO and public copies

The build generates actual HTML catalog and detail pages, route-specific metadata, structured data, JSON/CSV data and robots.txt. Reading the production output does not require JavaScript. React replaces the static content with the searchable interface.

The final product domain is **not selected yet**. The approved Cloudflare Pages deployment is a temporary public copy with `SITE_URL` unset. The build emits `sitemap-pending.json` rather than fabricated canonical URLs or a sitemap, and marks temporary responses `noindex, follow` through HTML metadata and a Cloudflare `_headers` file. This is intentionally browsable but excluded from search indexing.

Once the final domain is approved, set `SITE_URL` to its HTTPS origin and rebuild to generate absolute canonical/social URLs and `sitemap.xml` and remove the temporary indexing restriction. Do not use the company website's domain or a preview URL without approval. Indexing and ranking are never guaranteed.

## Cloudflare Pages

The dedicated Pages project `mesisem-public-resources` is linked only to `mgtechgroup/mesisem-global-llc`:

- Production branch: `main`; pushes trigger builds and deployments.
- Root directory: repository root.
- Build command: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm build`.
- Output directory: `dist/public`.
- Build image: v3; Node.js `22.16.0` is pinned in `.node-version`.
- Pin `PNPM_VERSION` to the version in `package.json`'s `packageManager` field.
- Leave `SITE_URL` unset until the final domain is approved.

No runtime secrets, Functions, paid add-ons or DNS changes are needed. Cloudflare serves the generated HTML for matching resource and methodology routes, with its default SPA fallback for other client-side routes. Do not add a catch-all rewrite that replaces the independently readable HTML pages.

Keep the temporary Pages address separate from the eventual product domain. Check the deployment status, homepage, a deep resource link, the methodology page and JSON/CSV downloads after each release. Existing Cloudflare projects and neighboring private workspace files are outside this deployment's scope.

## Maintain the catalog

Edit `public/data/resources.json`, run `validate:catalog`, review the resulting diff and build. Use stable descriptive IDs. Record the actual date a source was collected and reviewed, not its publication date. Company repository links use a fixed source commit to make the evidence reproducible. Unavailable sources remain explicitly marked until a reviewer obtains their content.

The initial collection and summary review used AI-assisted public-source reading. “Source reviewed” does not imply a separate human audit or certification of every statement.

`tools/collect_sources.py` is an optional conservative public-source metadata collector. It respects robots.txt, follows only catalog-listed HTTPS URLs on explicitly allowed public hosts, applies crawl delays, limits response sizes and produces **review candidates** under `.collection/`. It never changes the public catalog or review status automatically. Read publisher terms and licensing before running it; robots permission alone is not legal permission. No scheduled crawl is configured.

## Rights and corrections

Read each record's reuse note and the linked publisher's current license. Public availability is not permission to redistribute copyrighted material. Company branding is used for identification; no third-party rights are transferred by this repository. Avoid bulk text copying, private records, paywall bypass and scraping against access rules.

Submit a public issue or reviewed change with the record ID, source URL and correction evidence. Never include personal or confidential information. The public source repository is intended to hold **only this resource project**, not neighboring SaaSerize code, proof files, credentials or captured source snapshots.