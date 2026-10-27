import Link from 'next/link';
import { SITE } from '@/lib/content';

/** Structured data for Google (rich results). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

/** Visible breadcrumbs plus the matching BreadcrumbList schema. Last item is the current page. */
export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        {items.map((it, i) => (
          <span key={i} className="crumb">
            {it.href && i < items.length - 1 ? <Link href={it.href}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
            {i < items.length - 1 ? <span aria-hidden="true" className="sep">/</span> : null}
          </span>
        ))}
      </nav>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, ...(it.href ? { item: SITE + it.href } : {}) })) }} />
    </>
  );
}
