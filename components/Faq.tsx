import { FAQS } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { JsonLd } from './Seo';

export function Faq({ lang, schema = true }: { lang: Lang; schema?: boolean }) {
  return (
    <>
      <div className="faq">
        {FAQS.map((f, i) => (
          <details key={i} className="glass" open={i === 0}>
            <summary>{f.q[lang]}</summary>
            <p>{f.a[lang]}</p>
          </details>
        ))}
      </div>
      {schema ? <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })) }} /> : null}
    </>
  );
}
