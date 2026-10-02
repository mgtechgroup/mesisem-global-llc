import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import type { Resource } from '@/lib/catalog';

const base = import.meta.env.BASE_URL;
const NAV = [{ href: '/', label: 'Library' }, { href: '/methodology', label: 'Methodology' }];

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2">Skip to content</a>
      <header className="brushed text-[#C7D0D8] sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 ring-accent rounded-sm" data-testid="link-home">
            <img src={`${base}assets/mesisem-logo.png`} alt="Mesisem Global LLC logo" width={28} height={28} className="h-7 w-7 object-contain bg-[#C7D0D8] p-0.5 rounded-sm" />
            <span className="leading-tight">
              <span className="font-serif text-lg text-white block">Mesisem</span>
            </span>
            <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.18em] text-[#C7D0D8]/70 border-l border-white/20 pl-3">Public Resources</span>
          </Link>
          <nav aria-label="Primary" className="hidden sm:flex gap-1">
            {NAV.map(n => {
              const on = n.href === '/' ? loc === '/' || loc.startsWith('/resources') : loc.startsWith(n.href);
              return <Link key={n.href} href={n.href} aria-current={on ? 'page' : undefined} data-testid={`link-nav-${n.label.toLowerCase()}`}
                className={`px-3 py-1.5 text-sm border-b-2 transition-colors ${on ? 'border-accent text-white' : 'border-transparent hover:text-white'}`}>{n.label}</Link>;
            })}
          </nav>
          <button className="sm:hidden p-2 -mr-2" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(o => !o)} data-testid="button-menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav id="mnav" aria-label="Mobile" className="sm:hidden border-t border-white/10 px-4 py-2 flex flex-col rise">
            {NAV.map(n => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-sm border-b border-white/10 last:border-0">{n.label}</Link>)}
          </nav>
        )}
      </header>
      <main id="main" className="flex-1">{children}</main>
      <footer className="border-t bg-sidebar">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid gap-4 sm:grid-cols-[2fr_1fr] text-sm text-muted-foreground">
          <p className="max-w-xl">A reference library of public sources with recorded provenance. Entries are summaries with links; the original publisher's terms govern reuse. Inclusion is not endorsement, ranking or certification.</p>
          <div className="flex sm:justify-end gap-4 items-start">
            <Link href="/methodology" className="underline underline-offset-4 hover:text-foreground">Methodology</Link>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">Library</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b bg-gradient-to-b from-muted to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-3" style={{ color: 'hsl(36 78% 34%)' }}>{kicker}</p>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl text-balance">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function ExternalLink({ href, children, className = '', ...rest }: { href: string; children: ReactNode; className?: string; 'data-testid'?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 underline underline-offset-4 decoration-border hover:decoration-accent ${className}`} {...rest}>{children}<ArrowUpRight size={14} aria-hidden /></a>;
}

const tone: Record<string, string> = {
  'Source reviewed': 'bg-[hsl(160_30%_88%)] text-[hsl(160_40%_20%)] border-[hsl(160_25%_70%)]',
  'Company-provided': 'bg-[hsl(36_70%_90%)] text-[hsl(30_60%_22%)] border-[hsl(36_50%_70%)]',
  'Unavailable': 'bg-[hsl(4_40%_92%)] text-[hsl(4_60%_30%)] border-[hsl(4_40%_75%)]',
};
export function StatusBadge({ status }: { status: Resource['status'] }) {
  return <span className={`inline-block border px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider ${tone[status] || ''}`}>{status}</span>;
}
