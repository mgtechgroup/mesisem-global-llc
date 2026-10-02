# Mesisem Public Resources

A searchable public reference library for Mesisem Global LLC. It contains curated, original summaries and outbound source links—not private business records or wholesale copies of publisher websites.

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

This resource hub is **not published yet**. Set `SITE_URL` to its approved HTTPS production origin and rebuild to generate absolute canonical/social URLs and `sitemap.xml`. Do not use the company website's domain or a preview URL without domain approval. Without `SITE_URL` the build emits `sitemap-pending.json` rather than a fabricated sitemap. Confirm clean deep-link serving on the chosen host, including trailing-slash detail paths and SPA fallback for client navigation. Indexing and ranking are never guaranteed.

## Maintain the catalog

Edit `public/data/resources.json`, run `validate:catalog`, review the resulting diff and build. Use stable descriptive IDs. Record the actual date a source was collected and reviewed, not its publication date. Company repository links use a fixed source commit to make the evidence reproducible. Unavailable sources remain explicitly marked until a reviewer obtains their content.

The initial collection and summary review used AI-assisted public-source reading. “Source reviewed” does not imply a separate human audit or certification of every statement.

`tools/collect_sources.py` is an optional conservative public-source metadata collector. It respects robots.txt, follows only catalog-listed HTTPS URLs on explicitly allowed public hosts, applies crawl delays, limits response sizes and produces **review candidates** under `.collection/`. It never changes the public catalog or review status automatically. Read publisher terms and licensing before running it; robots permission alone is not legal permission. No scheduled crawl is configured.

## Rights and corrections

Read each record's reuse note and the linked publisher's current license. Public availability is not permission to redistribute copyrighted material. Company branding is used for identification; no third-party rights are transferred by this repository. Avoid bulk text copying, private records, paywall bypass and scraping against access rules.

Submit a public issue or reviewed change with the record ID, source URL and correction evidence. Never include personal or confidential information. The public source repository is intended to hold **only this resource project**, not neighboring SaaSerize code, proof files, credentials or captured source snapshots.