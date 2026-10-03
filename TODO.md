# Development, release and maintenance checklist

Keep this list current for every release. Do not mark remote work complete based only on local success. Never place credentials, personal information or private neighboring project files in this public repository.

## Development

- [x] Build the searchable public resource catalog and sourced detail pages.
- [x] Implement combined filters, sorting, URL state and JSON/CSV downloads.
- [x] Generate independently readable HTML for all 19 catalog and policy routes.
- [x] Validate the 17-record catalog, typecheck and build the standalone package.
- [x] Verify temporary builds omit canonical URLs and carry `noindex, follow`.
- [x] Publish and verify the initial isolated GitHub source export.

## Required before deployment

- [x] Explain and obtain confirmation of the final deployment steps.
- [x] Confirm the GitHub repository, Cloudflare target, branch and public visibility.
- [x] Confirm temporary hosting versus the final product domain.
- [x] Confirm any costs, DNS changes, secrets and external-account changes; do not assume approval.
- [x] Push the reviewed source update and verify the remote files.
- [x] Deploy only this resource hub to its dedicated Cloudflare Pages project.
- [x] Verify the deployment's build result and commit reference.
- [x] Check the live homepage, resource deep link, methodology, JSON and CSV.
- [x] Check temporary indexing headers and ensure final-domain metadata is not fabricated.
- [x] Update `PUBLISH_LOG.md` with the actual result, verification and any blockers.

## Further work

- [ ] Select and explicitly approve the final HTTPS product domain.
- [ ] Separately approve any DNS/custom-domain changes.
- [ ] Set `SITE_URL` to the approved origin and rebuild.
- [ ] Verify canonical/social URLs, sitemap, redirects and removal of temporary noindex.
- [ ] Confirm whether and when to submit the final sitemap to search engines.
- [ ] Review new public-source candidates before publishing them.
- [ ] Recheck the currently unavailable company website before changing its status.

## Maintenance — every release or scheduled review

- [ ] Review development and release checklists before publishing.
- [ ] Revalidate source links, collection/review dates, claim labels and reuse notes.
- [ ] Triage public corrections without collecting confidential information.
- [ ] Review dependency and runtime updates; typecheck and build proposed updates.
- [ ] Verify GitHub and Cloudflare remain synchronized with the intended release.
- [ ] Check homepage, deep links, metadata and downloads after deployment.
- [ ] Retain publish results and failure/blocker notes in `PUBLISH_LOG.md`.
- [ ] Confirm the desired maintenance schedule and responsible maintainer; neither is assumed.