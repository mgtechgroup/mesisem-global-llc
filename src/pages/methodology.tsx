import { Shell, PageHead } from '@/components/shell';
import { useSeo, useDataset, fmtDate } from '@/lib/catalog';

const S: [string, string[]][] = [
  ['What this library is', ['A reference list of public sources about enterprise technology, cybersecurity, marketing, analytics, ventures and Mesisem. Each entry is a short summary written for this library, plus a link to the original.', 'Entries from Mesisem are labelled Company-provided. The main company site is currently paused, so its marketing statements are not treated as verified assurances.']],
  ['Collection', ['The initial catalog was assembled using AI-assisted reading of public sources and original editorial summaries. Additions require review before publication. There is no unrestricted live scrape button, and visitors cannot trigger crawling from this site.', 'The collection policy requires respect for rate limits, robots.txt, publisher terms and licensing. The optional collector fails closed when robots permission is unclear. Private records, credentials and non-public material are outside the scope of this library.']],
  ['Verification', ['Each entry records when it was collected and when it was reviewed. A missing date means it was not recorded, and we do not backfill one.', 'Source reviewed means the summary was checked against fetched primary-source content. It is not a separate human audit or a certification of every claim. Company-provided means the reference came from Mesisem and was not independently verified. Unavailable means the expected content was unavailable at last review.']],
  ['Reuse', ['Public does not mean freely licensed. Every entry has a reuse note describing what we know about the publisher terms. When it is unclear, assume all rights are reserved and ask the publisher.', 'Summaries are written in our own words and are not wholesale copies. Catalog downloads contain our summaries and metadata only, not the source documents.']],
  ['What we do not claim', ['Inclusion is not endorsement. There is no ranking, scoring or certification of sources or publishers, and order in the list reflects only your sort choice.', 'Found an error or a source that should be removed? Publication is by manual review, so corrections are made in the next catalog version.']],
];

export default function Methodology() {
  useSeo('Collection Policy & Transparency | Mesisem Resources', 'Learn how Mesisem public resources are collected, attributed and reviewed, how status labels work, and what licensing and reuse limitations apply.', '/methodology');
  const { data } = useDataset();
  return (
    <Shell>
      <PageHead kicker="Methodology" title="How a source gets into the library, and what you may do with it.">
        {data && <p className="mt-4 font-mono text-xs text-muted-foreground">Catalog version {data.version}, updated {fmtDate(data.updatedAt)}, {data.resources.length} sources</p>}
      </PageHead>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {S.map(([h, ps], i) => (
          <section key={h} className="grid sm:grid-cols-[3rem_1fr] gap-x-4 rise" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
            <div><h2 className="font-serif text-2xl mb-2">{h}</h2>{ps.map(p => <p key={p} className="mb-3 leading-relaxed">{p}</p>)}</div>
          </section>
        ))}
        <section>
          <h2 className="font-serif text-2xl mb-2">Corrections and source proposals</h2>
          <p>Use the <a href="https://github.com/mgtechgroup/mesisem-global-llc/issues" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">public resource repository</a> to report a record ID, correction and supporting source. Do not submit private or sensitive information. No refresh schedule or indexing result is promised.</p>
        </section>
      </div>
    </Shell>
  );
}
