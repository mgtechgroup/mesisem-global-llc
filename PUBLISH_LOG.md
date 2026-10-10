# Publish log

Maintain a factual entry for each publish attempt. Include its target, branch, commit reference, actual outcome, checks and unresolved items. Never include API tokens, account credentials, private logs or personal information.

## Initial source publication

- Target: `https://github.com/mgtechgroup/mesisem-global-llc`
- Branch: `main`
- Commit: `4e04ee272fbeed6142a63ef7f88cbfe1874bf43b`
- Outcome: source publication succeeded; all 83 exported files matched the GitHub tree.
- Verification: standalone typecheck and build passed; 17 sourced records and 19 generated HTML routes checked.
- Hosting: no Cloudflare deployment was made in this source-only publication.
- Final product domain: not selected.

## Cloudflare-ready source update — before deployment

- Target repository: `mgtechgroup/mesisem-global-llc`, branch `main`.
- Planned hosting: a dedicated GitHub-linked Cloudflare Pages project, separate from existing projects.
- Changes: pinned Node.js runtime, temporary-host noindex metadata/headers, Pages build instructions, mandatory development/release/maintenance checklist and this log.
- Local checks: standalone typecheck/build passed; all 19 temporary HTML routes, noindex headers, JSON/CSV exports and dependency isolation verified.
- Remote source update: succeeded at commit `449f1df31d3f38f6919eafa21139f21949d4c489`; all 86 public files matched the remote tree.
- Hosting at this source-release stage: not deployed; final-step confirmation was still required.
- Final product domain: unset; no DNS changes or paid add-ons are authorized.
- Log/checklist bookkeeping is committed afterward; see the repository's `main` history for that commit.

## Temporary Cloudflare Pages publication — succeeded

- Date/time: `2026-10-03T08:48:23.072676Z` (UTC, deployment completion).
- User confirmation: “Deploy temporary Pages site.”
- Repository: `https://github.com/mgtechgroup/mesisem-global-llc`, branch `main`.
- Deployed source commit: `7c7174d3615ae5e37cc578de81d640bb88840abc`.
- Pages project: `mesisem-public-resources`, isolated from existing projects.
- Deployment ID: `5d30ec61-2571-4996-9803-287f9cb2f28d`.
- Deployment-specific URL: `https://5d30ec61.mesisem-public-resources.pages.dev`.
- Temporary public site: `https://mesisem-public-resources.pages.dev`.
- Actual outcome: Cloudflare reported successful initialization, Git clone, build and deployment.
- Live checks: all 19 generated HTML routes returned 200 with their readable page content and `noindex, follow`; JSON contains 17 records; CSV download passed; JavaScript and CSS assets returned 200.
- Indexing checks: no final canonical URLs, no final sitemap declaration, temporary metadata/header restrictions active, and the pending-sitemap file lists 19 routes.
- Git integration: `main` production deployments enabled; future approved pushes automatically build and publish. The release receipt/checklist update is documentation bookkeeping within this approved release.
- Costs/DNS/secrets: no paid add-ons, billing configuration changes, Functions, databases or DNS changes; no secrets copied into public source or output. Hosting actions used the connected Cloudflare account.
- Final product URL: still undecided; `SITE_URL` remains unset.
- Further work: approve the final domain and any DNS changes, then rebuild and verify final metadata/indexing. Agree on a maintenance schedule and maintainer.

## Final-domain Cloudflare Pages cutover — succeeded

- Completed: 2026-10-10T10:53:44.444723Z (UTC, Cloudflare deployment completion).
- Approved public origin: `https://mesisemglobal.com`; `www.mesisemglobal.com` is attached to the same Pages project.
- Repository: `mgtechgroup/mesisem-global-llc`, branch `main`; deployed source commit: `0d7295aca5aa4ae5021e8ed2eb7b0785eafe3f83`.
- Pages project: `mesisem-public-resources`; deployment ID: `45f52006-bcef-4856-a1b5-4a678193a22f`; deployment URL: `https://45f52006.mesisem-public-resources.pages.dev`.
- Outcome: Cloudflare reported queued, initialize, clone, build and deploy stages successful. The production build command was `pnpm install --frozen-lockfile && pnpm typecheck && pnpm build`; `build` validates the catalog, builds the site and generates SEO files. There is no standalone `test` script in `package.json`.
- Live verification: apex, `www`, and the Pages preview returned HTTP 200; both Pages custom domains reported `active`. All 19 sitemap routes returned 200 and canonicalized to the apex; the sitemap contains 19 final-origin URLs; `robots.txt` allows crawling and points to that sitemap; the temporary noindex header/meta is absent. JSON contains 17 records; CSV returns 17 data rows plus a header; JS and CSS assets returned 200.
- DNS: only the apex and `www` CNAME targets were changed to `mesisem-public-resources.pages.dev`; existing proxy and TTL settings were preserved. Other DNS records, including mail, verification and nameserver records, were not changed. The Vercel project was not deleted; public DNS no longer points these hosts to it.
- `SITE_URL`: production setting is `https://mesisemglobal.com`; canonical URLs and sitemap now use the approved origin.
- Databases: the user chose to keep the existing static JSON/CSV catalog; no Supabase/Neon database or runtime dependency was added.
- Costs and secrets: no paid add-ons or secret changes were made.
- Follow-up: decide whether and when to submit the sitemap to search engines; review the database data flow before adding a backend.

## Entry template

- Date/time (with timezone):
- Target repository / branch / commit:
- Hosting project / deployment ID / actual URL:
- Approved final steps and scope:
- Outcome: succeeded / failed / blocked.
- Checks and evidence:
- Costs / DNS / secret changes:
- Blockers and next steps: