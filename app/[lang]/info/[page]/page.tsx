import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { INFO, type Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; page: string }> }): Promise<Metadata> {
  const { lang, page } = await params;
  return INFO[page] ? { title: INFO[page].title[lang] } : {};
}

export default async function Info({ params }: { params: Promise<{ lang: Lang; page: string }> }) {
  const { lang, page } = await params;
  const p = INFO[page];
  if (!p) notFound();
  return (
    <div className="wrap" style={{ maxWidth: 760, margin: '50px auto 70px' }}>
      <h1 style={{ fontSize: 'clamp(30px,4vw,42px)', marginBottom: 20 }}>{p.title[lang]}</h1>
      <div className="glass pad" style={{ display: 'grid', gap: 14 }}>
        {p.body[lang].split('\n').map((para, i) => <p key={i} style={{ margin: 0, color: 'var(--muted)', fontSize: 16 }}>{para}</p>)}
      </div>
    </div>
  );
}
