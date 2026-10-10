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

## Final-domain Cloudflare Pages cutover — in progress

- Date/time: 2026-10-10 (UTC).
- Target repository: `mgtechgroup/mesisem-global-llc`, branch `main`; hosting project: `mesisem-public-resources`.
- Approved public origin: `https://mesisemglobal.com`; `www.mesisemglobal.com` is also attached to Pages.
- Changes applied: apex and `www` CNAMEs now target `mesisem-public-resources.pages.dev`; production `SITE_URL` is set to `https://mesisemglobal.com`. Existing proxy/TTL settings and all MX, TXT, and NS records were preserved. No database, Vercel project, or other Cloudflare project was changed.
- Validation: Cloudflare reported both custom-domain verifications active, with HTTP validation still pending. At 2026-10-10 10:51 UTC, both public hosts returned HTTP 522; the Pages production build had not yet rerun with the new setting.
- Outcome: in progress; GitHub `main` push will trigger the production build. Do not treat either custom host as live until the new deployment and HTTP checks pass.

## Entry template

- Date/time (with timezone):
- Target repository / branch / commit:
- Hosting project / deployment ID / actual URL:
- Approved final steps and scope:
- Outcome: succeeded / failed / blocked.
- Checks and evidence:
- Costs / DNS / secret changes:
- Blockers and next steps: