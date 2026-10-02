import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog, escape as e, validateCatalog, exportCsv } from './catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist/public');
const template = await readFile(path.join(out, 'index.html'), 'utf8');
validateCatalog();
await exportCsv(path.join(out, 'data/resources.csv'));
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const origin = process.env.SITE_URL?.replace(/\/$/, '');
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be an approved HTTPS origin');
}
const local = route => `${base}${route.replace(/^\//, '')}`;
const absolute = route => origin ? origin + local(route) : undefined;
const link = (route, title) => `<a href="${e(local(route))}">${e(title)}</a>`;
const source = r => `<a href="${e(r.sourceUrl)}" rel="noopener noreferrer">${e(r.publisher)} — original source</a>`;
const record = r => `<article><h2>${link(`resources/${r.id}/`, r.title)}</h2><p>${e(r.summary)}</p><p>${e(r.category)} · ${e(r.type)} · ${e(r.status)}</p><p>${source(r)}</p><p>Collected ${e(r.collectedAt)} · Reviewed ${e(r.reviewedAt)}</p><p>${e(r.reuse)}</p><p>${e(r.notes)}</p></article>`;
const policy = `<h1>Collection methodology and transparency</h1><h2>Public, sourced and reviewable</h2><p>This is a curated public reference catalog, not an exhaustive internet index. Initial discovery used public search, publisher documentation and the public Mesisem website repository. Each record links to a source and shows its collection and review dates. Summaries are editorial descriptions, not wholesale mirrors.</p><h2>What the labels mean</h2><p>Source reviewed means the linked primary source was read at the listed date. It does not certify the publisher or verify every claim. Company-provided means a self-reported company description. Unavailable means the source could not supply its expected content during collection; it may become available later.</p><h2>Responsible collection</h2><p>No private accounts, internal databases, paywall bypass, identity records or private client data are collected. Automation must respect robots.txt, terms, licensing and conservative rate limits. Collection produces review candidates; it never automatically promotes a source to verified status.</p><h2>Reuse and rights</h2><p>Public accessibility is not permission to reproduce content. Read each record's reuse note and the publisher's current license before copying material. This hub supplies summaries, provenance and outbound links; it does not transfer third-party rights.</p><h2>Corrections and maintenance</h2><p>Report a correction or propose a sourced addition through the ${link('','catalog')}, or the <a href="https://github.com/mgtechgroup/mesisem-global-llc/issues" rel="noopener noreferrer">public resource repository</a>. Describe the affected record and supporting evidence; do not submit sensitive information. Changes are reviewed before publication. No fixed refresh schedule or SEO result is promised.</p>`;
const crawlStyles = `<style>.crawl-content{max-width:1080px;margin:30px auto;padding:30px;font:16px/1.65 system-ui,sans-serif;color:#1c2939;background:#f6f8fa}.crawl-content a{color:#264e77}.crawl-content article{padding:20px 0;border-bottom:1px solid #c5cfda}.crawl-content nav{display:flex;gap:20px}.crawl-content h1{font-size:2.2rem}.crawl-content h2{font-size:1.4rem}</style>`;

async function page(route, title, description, body, structured) {
  const canonical = absolute(route);
  const image = absolute('assets/mesisem-logo.png');
  const metadata = `<title>${e(title)}</title>
<meta name="description" content="${e(description)}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(description)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(description)}">
${canonical ? `<meta name="site-origin" content="${e(origin)}"><link rel="canonical" href="${e(canonical)}"><meta property="og:url" content="${e(canonical)}">` : ''}
${image ? `<meta property="og:image" content="${e(image)}"><meta name="twitter:image" content="${e(image)}">` : ''}
<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\s+(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")\s+[^>]*>/g, '');
  html = html.replace('</head>', metadata + crawlStyles + '</head>');
  const fallback = `<main class="crawl-content"><nav>${link('', 'Mesisem Public Resources')}${link('methodology/', 'Collection policy')}<a href="${e(local('data/resources.json'))}">JSON catalog</a><a href="${e(local('data/resources.csv'))}">CSV catalog</a></nav>${body}</main>`;
  // Content is present even with JS disabled. React replaces the static root on load.
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${fallback}</div>`);
  const destination = route ? path.join(out, route, 'index.html') : path.join(out, 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
const routes = ['', 'methodology/'];
await page('', 'Mesisem Public Resources | Sourced Enterprise Library',
  'Explore public references for technology, security, marketing and business. Search original summaries with source links, review dates and clear reuse notes.',
  `<h1>Mesisem Public Resources</h1><p>A sourced reference library for enterprise research. ${catalog.resources.length} records, updated ${e(catalog.updatedAt)}.</p>${catalog.resources.map(record).join('')}`,
  { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Mesisem Public Resources', ...(absolute('') ? { url: absolute('') } : {}), mainEntity: { '@type': 'ItemList', numberOfItems: catalog.resources.length, itemListElement: catalog.resources.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.title, url: absolute(`resources/${r.id}/`) || r.sourceUrl })) } });
await page('methodology/', 'Collection Policy & Transparency | Mesisem Resources',
  'Learn how Mesisem public resources are collected, attributed and reviewed, how status labels work, and what licensing and reuse limitations apply.', policy,
  { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Collection methodology and transparency' });
for (const r of catalog.resources) {
  const route = `resources/${r.id}/`;
  routes.push(route);
  await page(route, `${r.title} | Mesisem Resources`, r.summary,
    `<h1>${e(r.title)}</h1><p>${e(r.summary)}</p><p>${e(r.category)} · ${e(r.type)} · ${e(r.status)}</p><h2>Original source</h2><p>${source(r)}</p><h2>Provenance</h2><p>Collected: ${e(r.collectedAt)}. Reviewed: ${e(r.reviewedAt)}.</p><p>${e(r.notes)}</p><h2>Reuse</h2><p>${e(r.reuse)}</p>`,
    { '@context': 'https://schema.org', '@type': 'WebPage', name: r.title, description: r.summary, dateModified: r.reviewedAt, citation: r.sourceUrl, ...(absolute(route) ? { url: absolute(route) } : {}) });
}
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: ${base}\n${origin ? `Sitemap: ${absolute('sitemap.xml')}\n` : '# Sitemap awaits approved SITE_URL. No development URL published.\n'}`);
if (origin) await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${e(absolute(route))}</loc><lastmod>${catalog.updatedAt}</lastmod></url>`).join('')}</urlset>`);
else await writeFile(path.join(out, 'sitemap-pending.json'), JSON.stringify({ reason: 'Set SITE_URL to the approved published origin and rebuild to emit sitemap.xml and canonical/social URLs.', routes: routes.map(local) }, null, 2));
console.log(`Generated ${routes.length} crawlable HTML pages; ${origin ? 'canonical URLs and sitemap ready' : 'production URL pending'}.`);