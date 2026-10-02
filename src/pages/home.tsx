import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Search, X, Download, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { Shell, PageHead, StatusBadge } from '@/components/shell';
import { useDataset, useFilters, filterResources, countBy, fmtDate, downloadJSON, downloadCSV, useSeo, TYPES, STATUSES, SORTS, type Resource } from '@/lib/catalog';

function Hl({ text, q }: { text: string; q: string }) {
  const terms = q.split(/\s+/).filter(t => t.length > 1).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return <>{text}</>;
  return <>{text.split(new RegExp(`(${terms.join('|')})`, 'ig')).map((p, i) => i % 2 ? <mark key={i}>{p}</mark> : p)}</>;
}

const sel = 'h-10 w-full border border-input bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 ring-ring';

function Card({ r, q }: { r: Resource; q: string }) {
  return (
    <li className="group relative border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 rise" data-testid={`card-resource-${r.id}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>{r.type}</span><span aria-hidden>/</span><span>{r.category}</span>
        <span className="ml-auto"><StatusBadge status={r.status} /></span>
      </div>
      <h2 className="font-serif text-xl leading-snug">
        <Link href={`/resources/${r.id}`} className="after:absolute after:inset-0 outline-none focus-visible:after:ring-2 ring-ring group-hover:underline underline-offset-4" data-testid={`link-resource-${r.id}`}><Hl text={r.title} q={q} /></Link>
      </h2>
      <p className="text-sm text-muted-foreground mt-1"><Hl text={r.publisher} q={q} /></p>
      <p className="text-sm mt-3 line-clamp-3"><Hl text={r.summary} q={q} /></p>
      <ul className="flex flex-wrap gap-1.5 mt-4">
        {r.tags.slice(0, 5).map(t => <li key={t} className="bg-muted px-1.5 py-0.5 text-xs"><Hl text={t} q={q} /></li>)}
      </ul>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">Reviewed {fmtDate(r.reviewedAt)}</p>
    </li>
  );
}

export default function Home() {
  const { data, error, retry } = useDataset();
  const { f, set, reset } = useFilters();
  useSeo('Mesisem Public Resources | Sourced Enterprise Library', 'Explore public references for technology, security, marketing and business. Search original summaries with source links, review dates and clear reuse notes.', '/');
  const [q, setQ] = useState(f.q);
  useEffect(() => setQ(f.q), [f.q]);
  useEffect(() => {
    if (q === f.q) return;
    const t = setTimeout(() => set({ q }), 200);
    return () => clearTimeout(t);
  }, [q, f.q, set]);

  const all = data?.resources ?? [];
  const results = useMemo(() => filterResources(all, f), [all, f]);
  const catCounts = useMemo(() => countBy(all, 'category'), [all]);
  const categories = useMemo(() => [...catCounts.keys()].sort(), [catCounts]);
  const active = !!(f.q || f.category || f.status || f.type);
  const statusCounts = useMemo(() => countBy(all, 'status'), [all]);
  const typeCounts = useMemo(() => countBy(all, 'type'), [all]);
  const publishers = useMemo(() => new Set(all.map(r => r.publisher)).size, [all]);

  return (
    <Shell>
      <PageHead kicker="Source-first public reference" title="Public sources on enterprise technology, security and growth, with the receipts.">
        <p className="mt-4 max-w-2xl text-muted-foreground">Every entry links to its original publisher and records when it was collected, when it was reviewed, and what reuse the source allows. <Link href="/methodology" className="underline underline-offset-4 text-foreground">How entries are collected</Link>.</p>
        {data && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 font-mono" data-testid="stats">
            {[['Sources', all.length], ['Publishers', publishers], ['Categories', categories.length], ['Catalog updated', fmtDate(data.updatedAt)]].map(([k, v]) => (
              <div key={k as string}><dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="text-xl text-foreground">{v}</dd></div>
            ))}
          </dl>
        )}
      </PageHead>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <aside aria-label="Categories" className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Categories</h2>
          {!data ? <div className="space-y-2">{[0, 1, 2, 3].map(i => <div key={i} className="h-8 bg-muted animate-pulse" />)}</div> : (
            <nav aria-label="Category navigation">
              <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
                {[['', 'All sources', all.length] as const, ...categories.map(c => [c, c, catCounts.get(c) || 0] as const)].map(([v, l, n]) => (
                  <li key={v} className="shrink-0">
                    <button onClick={() => set({ category: v })} aria-pressed={f.category === v} data-testid={`button-category-${v || 'all'}`}
                      className={`w-full flex justify-between gap-3 border-l-2 px-3 py-1.5 text-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 ring-ring ${f.category === v ? 'border-accent bg-card font-medium' : 'border-transparent hover:bg-muted'}`}>
                      <span>{l}</span><span className="font-mono text-xs text-muted-foreground">{n}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        <section aria-label="Catalog">
          <form role="search" onSubmit={e => { e.preventDefault(); set({ q }); }} className="space-y-3">
            <div className="relative">
              <label htmlFor="q" className="sr-only">Search titles, summaries, tags and publishers</label>
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input id="q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search titles, summaries, tags, publishers" data-testid="input-search"
                className="w-full h-12 border border-input bg-card pl-10 pr-10 focus-visible:outline-none focus-visible:ring-2 ring-ring" />
              {q && <button type="button" onClick={() => { setQ(''); set({ q: '' }); }} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground" data-testid="button-clear-search"><X size={16} /></button>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['type', 'Type', TYPES.map(t => [t, `${t} (${typeCounts.get(t) || 0})`])],
                ['status', 'Status', STATUSES.map(t => [t, `${t} (${statusCounts.get(t) || 0})`])],
                ['sort', 'Sort', SORTS.map(s => [s.v, s.l])],
              ].map(([k, label, opts]) => (
                <div key={k as string}>
                  <label htmlFor={`f-${k}`} className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{label as string}</label>
                  <select id={`f-${k}`} className={sel} value={f[k as 'type']} onChange={e => set({ [k as string]: e.target.value })} data-testid={`select-${k}`}>
                    {k !== 'sort' && <option value="">All</option>}
                    {(opts as string[][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-end">
                <button type="button" disabled={!active && f.sort === 'relevance'} onClick={() => { setQ(''); reset(); }} className="h-10 w-full border border-input px-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-muted disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 ring-ring" data-testid="button-reset"><RotateCcw size={14} />Reset</button>
              </div>
            </div>
          </form>

          <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <p className="text-sm" role="status" aria-live="polite" data-testid="text-count">
              {data ? <><strong className="font-mono">{results.length}</strong> of {all.length} sources{f.category && <> in {f.category}</>}</> : error ? 'Catalog unavailable' : 'Loading catalog'}
            </p>
            {data && (
              <div className="flex gap-2">
                <button onClick={() => downloadJSON(data, results)} disabled={!results.length} className="h-8 px-3 border border-input text-xs font-mono inline-flex items-center gap-1.5 hover:bg-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 ring-ring" data-testid="button-download-json"><Download size={13} />JSON</button>
                <button onClick={() => downloadCSV(results)} disabled={!results.length} className="h-8 px-3 border border-input text-xs font-mono inline-flex items-center gap-1.5 hover:bg-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 ring-ring" data-testid="button-download-csv"><Download size={13} />CSV</button>
              </div>
            )}
          </div>

          {error ? (
            <div role="alert" className="border border-destructive/40 bg-card p-8" data-testid="state-error">
              <AlertTriangle className="text-destructive mb-3" />
              <h2 className="font-serif text-xl">The catalog could not be loaded</h2>
              <p className="text-sm text-muted-foreground mt-1">{error}. No results are shown rather than stale or partial ones.</p>
              <button onClick={retry} className="mt-4 h-9 px-4 bg-primary text-primary-foreground text-sm focus-visible:outline-none focus-visible:ring-2 ring-ring ring-offset-2" data-testid="button-retry">Try again</button>
            </div>
          ) : !data ? (
            <ul className="grid md:grid-cols-2 gap-4" aria-busy="true">{[0, 1, 2, 3, 4, 5].map(i => <li key={i} className="h-44 border bg-card"><div className="m-5 space-y-3"><div className="h-3 w-1/3 bg-muted animate-pulse" /><div className="h-5 w-4/5 bg-muted animate-pulse" /><div className="h-3 w-full bg-muted animate-pulse" /><div className="h-3 w-2/3 bg-muted animate-pulse" /></div></li>)}</ul>
          ) : results.length === 0 ? (
            <div className="border border-dashed border-input p-10 text-center" data-testid="state-empty">
              <h2 className="font-serif text-2xl">{all.length ? 'No sources match' : 'The catalog is empty'}</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{all.length ? 'Nothing in the reviewed catalog matches these terms and filters. Entries are added only after manual review, so absence here is not a statement about the wider web.' : 'No sources have been published in this version.'}</p>
              {active && <button onClick={() => { setQ(''); reset(); }} className="mt-5 h-9 px-4 bg-primary text-primary-foreground text-sm inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 ring-ring ring-offset-2" data-testid="button-empty-reset"><RotateCcw size={14} />Clear search and filters</button>}
            </div>
          ) : (
            <ul className="grid md:grid-cols-2 gap-4">
              {results.map(r => <Card key={r.id} r={r} q={f.q} />)}
            </ul>
          )}
          {data && <p className="mt-8 text-xs text-muted-foreground flex items-center gap-1">Downloads contain the {results.length} sources currently shown. <Link href="/methodology" className="underline underline-offset-4 inline-flex items-center gap-1">Reuse terms<ArrowRight size={12} /></Link></p>}
        </section>
      </div>
    </Shell>
  );
}
