import { Link, useParams } from 'wouter';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Shell, StatusBadge } from '@/components/shell';
import { useDataset, useSeo, fmtDate } from '@/lib/catalog';

export default function ResourcePage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, retry } = useDataset();
  const r = data?.resources.find(x => x.id === id);
  useSeo(r ? `${r.title} | Mesisem Resources` : 'Resource | Mesisem Public Resources', r ? r.summary : 'Source record in the Mesisem Public Resources library.', `/resources/${id}`);
  const related = data && r ? data.resources.filter(x => x.category === r.category && x.id !== r.id).slice(0, 4) : [];
  const facts: [string, string][] = r ? [['Publisher', r.publisher], ['Type', r.type], ['Category', r.category], ['Collected', fmtDate(r.collectedAt)], ['Reviewed', fmtDate(r.reviewedAt)]] : [];

  return (
    <Shell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground" data-testid="link-back"><ArrowLeft size={14} />All sources</Link>
        {error ? (
          <div role="alert" className="mt-6 border border-destructive/40 bg-card p-8" data-testid="state-error">
            <AlertTriangle className="text-destructive mb-3" /><h1 className="font-serif text-2xl">The catalog could not be loaded</h1>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <button onClick={retry} className="mt-4 h-9 px-4 bg-primary text-primary-foreground text-sm" data-testid="button-retry">Try again</button>
          </div>
        ) : !data ? (
          <div className="mt-8 space-y-4" aria-busy="true"><div className="h-4 w-40 bg-muted animate-pulse" /><div className="h-10 w-3/4 bg-muted animate-pulse" /><div className="h-40 bg-muted animate-pulse" /></div>
        ) : !r ? (
          <div className="mt-8 border border-dashed border-input p-10 text-center" data-testid="state-missing">
            <h1 className="font-serif text-3xl">No such source</h1>
            <p className="text-sm text-muted-foreground mt-2">No entry with the identifier "{id}" exists in this catalog version.</p>
            <Link href="/" className="inline-block mt-5 h-9 leading-9 px-4 bg-primary text-primary-foreground text-sm">Browse the library</Link>
          </div>
        ) : (
          <article className="mt-6 rise">
            <div className="flex flex-wrap gap-3 items-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <Link href={`/?category=${encodeURIComponent(r.category)}`} className="hover:text-foreground underline underline-offset-4">{r.category}</Link>
              <StatusBadge status={r.status} />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight mt-3 text-balance" data-testid="text-title">{r.title}</h1>
            <p className="mt-5 text-lg max-w-3xl">{r.summary}</p>
            <div className="mt-8 grid md:grid-cols-[1fr_280px] gap-8">
              <div className="space-y-6 order-2 md:order-1">
                <section className="border-l-2 border-accent pl-5"><h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Reuse</h2><p data-testid="text-reuse">{r.reuse || 'Not recorded. Check the publisher terms.'}</p></section>
                <section className="border-l-2 border-primary/40 pl-5"><h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Reviewer notes</h2><p>{r.notes || 'No notes recorded.'}</p></section>
                <section><h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Tags</h2>
                  <ul className="flex flex-wrap gap-1.5">{r.tags.map(t => <li key={t}><Link href={`/?q=${encodeURIComponent(t)}`} className="block bg-muted hover:bg-secondary px-2 py-1 text-sm">{t}</Link></li>)}</ul></section>
                <p className="text-xs text-muted-foreground">This page summarizes the source. It is not a copy and carries no endorsement. See the <Link href="/methodology" className="underline underline-offset-4">methodology</Link>.</p>
              </div>
              <aside className="order-1 md:order-2 border bg-card p-5 self-start" aria-label="Provenance">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">Provenance</h2>
                <dl className="space-y-3 text-sm">{facts.map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}</dl>
                <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 h-10 bg-primary text-primary-foreground text-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 ring-ring ring-offset-2" data-testid="link-source">Open original source</a>
                <p className="mt-2 text-[11px] font-mono break-all text-muted-foreground">{r.sourceUrl}</p>
              </aside>
            </div>
            {related.length > 0 && <section className="mt-12 border-t pt-6"><h2 className="font-serif text-xl mb-3">More in {r.category}</h2>
              <ul className="grid sm:grid-cols-2 gap-x-8">{related.map(x => <li key={x.id} className="border-b py-2"><Link href={`/resources/${x.id}`} className="hover:underline underline-offset-4">{x.title}</Link><span className="block text-xs text-muted-foreground">{x.publisher}</span></li>)}</ul></section>}
          </article>
        )}
      </div>
    </Shell>
  );
}
