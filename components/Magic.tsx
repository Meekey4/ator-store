'use client';
/**
 * Small animated details adapted from Magic UI (https://magicui.design, MIT licence),
 * rewritten in plain CSS + React and restyled in the ATOR palette.
 * Marquee, WordRotate and NumberTicker live here; ShimmerButton (.shimmer) and BorderBeam (.beam) are CSS-only in globals.css.
 * Everything stands still for visitors who ask for reduced motion.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';

const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Endless scrolling strip. Content is repeated once so the loop is seamless; the copy is hidden from screen readers. */
export function Marquee({ children, reverse, seconds = 40, label }: { children: ReactNode; reverse?: boolean; seconds?: number; label?: string }) {
  return (
    <div className={`marquee${reverse ? ' rev' : ''}`} style={{ ['--dur' as string]: `${seconds}s` }} role="region" aria-label={label}>
      <div className="mq-track">
        <div className="mq-group">{children}</div>
        <div className="mq-group" aria-hidden="true" inert>{children}</div>
      </div>
    </div>
  );
}

/** Cycles through words in place. The first word is rendered on the server, so the line is never empty. */
export function WordRotate({ words, ms = 2400 }: { words: string[]; ms?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || still()) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), ms);
    return () => clearInterval(id);
  }, [words.length, ms]);
  return (
    <span className="wrot" aria-live="off">
      <span key={i} className="wrot-w">{words[i]}</span>
    </span>
  );
}

/** Counts up from 0 the first time it scrolls into view. Server HTML already holds the final number. */
export function NumberTicker({ value, ms = 1400, suffix = '' }: { value: number; ms?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || still()) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / ms);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      setN(0);
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, ms]);
  return <span ref={ref} className="num ticker">{n}{suffix}</span>;
}
