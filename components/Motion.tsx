'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const REVEAL = '.section-h, .card, .perk, .steps li, .faq details, .mini, .pdp .media, .pdp > div > *, .glass.pad, .chips, .ftr-grid > *';

/** Browsing feel: top loading bar between pages, 3D tilt + light glare on product cards, and content that glides in on scroll. */
export function Motion() {
  const path = usePathname();
  const sp = useSearchParams();
  const [bar, setBar] = useState<'idle' | 'run' | 'done'>('idle');

  // Finish the loading bar when the new page has arrived.
  useEffect(() => { setBar((b) => (b === 'run' ? 'done' : b)); const t = setTimeout(() => setBar('idle'), 450); return () => clearTimeout(t); }, [path, sp]);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.classList.add('motion');

    // Scroll reveal, staggered by position in the row.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { const el = e.target as HTMLElement; el.classList.add('in'); io.unobserve(el); setTimeout(() => { el.classList.remove('rv'); el.style.removeProperty('--d'); }, 1300); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter((el) => !el.classList.contains('in'));
    els.forEach((el, i) => {
      const sib = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : i;
      el.style.setProperty('--d', `${Math.min(sib, 7) * 70}ms`);
      el.classList.add('rv');
      if (reduce) el.classList.add('in'); else io.observe(el);
    });

    // Loading bar on internal link clicks.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      setBar('run');
      a.closest('.card')?.classList.add('pressed');
    };

    // 3D tilt with a light glare that follows the pointer.
    const onMove = (e: PointerEvent) => {
      if (reduce || e.pointerType !== 'mouse') return;
      const c = (e.target as HTMLElement).closest<HTMLElement>('.card, .pdp .media, .hero-art');
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const k = c.classList.contains('card') ? 9 : 6;
      c.style.setProperty('--rx', `${(0.5 - y) * k}deg`);
      c.style.setProperty('--ry', `${(x - 0.5) * k}deg`);
      c.style.setProperty('--gx', `${x * 100}%`);
      c.style.setProperty('--gy', `${y * 100}%`);
      c.classList.add('tilting');
    };
    const onLeave = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest?.('.card, .pdp .media, .hero-art') as HTMLElement | null;
      if (c && !c.contains(e.relatedTarget as Node)) { c.classList.remove('tilting'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); }
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onLeave, { passive: true });
    return () => { io.disconnect(); document.removeEventListener('click', onClick, true); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerout', onLeave); };
  }, [path, sp]);

  return <div className={`navbar ${bar}`} aria-hidden="true" />;
}
