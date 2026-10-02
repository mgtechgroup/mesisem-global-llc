import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearch, useLocation } from 'wouter';

export type RType = 'Guide' | 'Standard' | 'Dataset' | 'Repository';
export type RStatus = 'Source reviewed' | 'Company-provided' | 'Unavailable';
export interface Resource {
  id: string; title: string; summary: string; category: string; tags: string[];
  publisher: string; sourceUrl: string; type: RType; status: RStatus;
  collectedAt?: string | null; reviewedAt?: string | null; reuse: string; notes: string; featured: boolean;
}
export interface Dataset { version: 1; updatedAt: string; resources: Resource[] }

export const TYPES: RType[] = ['Guide', 'Standard', 'Dataset', 'Repository'];
export const STATUSES: RStatus[] = ['Source reviewed', 'Company-provided', 'Unavailable'];
export const SORTS = [
  { v: 'relevance', l: 'Relevance' }, { v: 'title', l: 'Title A-Z' },
  { v: 'reviewed', l: 'Recently reviewed' }, { v: 'publisher', l: 'Publisher A-Z' },
] as const;

export const dataUrl = `${import.meta.env.BASE_URL}data/resources.json`;

export function useDataset() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let off = false;
    setData(null); setError(null);
    fetch(dataUrl).then(r => {
      if (!r.ok) throw new Error(`Catalog request failed (HTTP ${r.status})`);
      return r.json();
    }).then((d: Dataset) => {
      if (!d || !Array.isArray(d.resources)) throw new Error('Catalog file is not in the expected format');
      if (!off) setData(d);
    }).catch(e => { if (!off) setError(e.message || 'Unable to load catalog'); });
    return () => { off = true; };
  }, [tick]);
  return { data, error, retry: () => setTick(t => t + 1) };
}

export interface Filters { q: string; category: string; status: string; type: string; sort: string }
export const EMPTY: Filters = { q: '', category: '', status: '', type: '', sort: 'relevance' };

export function useFilters() {
  const search = useSearch();
  const [, nav] = useLocation();
  const f = useMemo<Filters>(() => {
    const p = new URLSearchParams(search);
    return { q: p.get('q') || '', category: p.get('category') || '', status: p.get('status') || '', type: p.get('type') || '', sort: p.get('sort') || 'relevance' };
  }, [search]);
  const set = useCallback((patch: Partial<Filters>) => {
    const n = { ...f, ...patch };
    const p = new URLSearchParams();
    (Object.keys(n) as (keyof Filters)[]).forEach(k => { if (n[k] && n[k] !== EMPTY[k]) p.set(k, n[k]); });
    const s = p.toString();
    nav(s ? `/?${s}` : '/', { replace: true });
  }, [f, nav]);
  return { f, set, reset: () => nav('/', { replace: true }) };
}

export function filterResources(list: Resource[], f: Filters) {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const scored: { r: Resource; s: number }[] = [];
  for (const r of list) {
    if (f.category && r.category !== f.category) continue;
    if (f.status && r.status !== f.status) continue;
    if (f.type && r.type !== f.type) continue;
    let s = r.featured ? 1 : 0;
    let ok = true;
    for (const t of terms) {
      let m = 0;
      if (r.title.toLowerCase().includes(t)) m += 5;
      if (r.tags.some(x => x.toLowerCase().includes(t))) m += 3;
      if (r.publisher.toLowerCase().includes(t)) m += 3;
      if (r.summary.toLowerCase().includes(t)) m += 1;
      if (!m) { ok = false; break; }
      s += m;
    }
    if (ok) scored.push({ r, s });
  }
  const d = (x?: string | null) => (x ? Date.parse(x) || 0 : 0);
  scored.sort((a, b) => {
    switch (f.sort) {
      case 'title': return a.r.title.localeCompare(b.r.title);
      case 'publisher': return a.r.publisher.localeCompare(b.r.publisher) || a.r.title.localeCompare(b.r.title);
      case 'reviewed': return d(b.r.reviewedAt) - d(a.r.reviewedAt) || a.r.title.localeCompare(b.r.title);
      default: return b.s - a.s || a.r.title.localeCompare(b.r.title);
    }
  });
  return scored.map(x => x.r);
}

export function countBy(list: Resource[], key: 'category' | 'status' | 'type') {
  const m = new Map<string, number>();
  list.forEach(r => m.set(r[key], (m.get(r[key]) || 0) + 1));
  return m;
}

export function fmtDate(s?: string | null) {
  if (!s) return 'Not recorded';
  const d = new Date(s);
  return isNaN(+d) ? s : d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function download(name: string, mime: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: mime }));
  const a = document.createElement('a'); a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
export function downloadJSON(d: Dataset, list: Resource[]) {
  download('mesisem-resources.json', 'application/json', JSON.stringify({ ...d, resources: list }, null, 2));
}
export function downloadCSV(list: Resource[]) {
  const cols = ['id', 'title', 'summary', 'category', 'tags', 'publisher', 'sourceUrl', 'type', 'status', 'collectedAt', 'reviewedAt', 'reuse', 'notes', 'featured'] as const;
  const esc = (v: unknown) => `"${String(v ?? '').replace(/^([=+\-@\t\r])/, "'$1").replace(/"/g, '""')}"`;
  const rows = list.map(r => cols.map(c => esc(c === 'tags' ? r.tags.join('; ') : r[c])).join(','));
  download('mesisem-resources.csv', 'text/csv', [cols.join(','), ...rows].join('\n'));
}

export function useSeo(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    set('meta[name="description"]', 'name', 'description', description);
    set('meta[property="og:title"]', 'property', 'og:title', title);
    set('meta[property="og:description"]', 'property', 'og:description', description);
    set('meta[property="og:type"]', 'property', 'og:type', 'website');
    set('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    set('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    const origin = document.head.querySelector<HTMLMetaElement>('meta[name="site-origin"]')?.content;
    if (origin) {
      const route = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
      const url = origin + import.meta.env.BASE_URL.replace(/\/$/, '') + route;
      set('meta[property="og:url"]', 'property', 'og:url', url);
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = url;
    }
  }, [title, description, path]);
}
