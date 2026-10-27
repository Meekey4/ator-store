'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type CartLine = { slug: string; planId: string; qty: number };
type Ctx = { lines: CartLine[]; add: (l: Omit<CartLine, 'qty'>, qty?: number) => void; setQty: (slug: string, planId: string, qty: number) => void; clear: () => void; count: number; ready: boolean; toast: string; flash: (m: string) => void };
const C = createContext<Ctx | null>(null);
const KEY = 'ator_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {} }, [lines, ready]);
  const add: Ctx['add'] = (l, qty = 1) => setLines((ls) => {
    const i = ls.findIndex((x) => x.slug === l.slug && x.planId === l.planId);
    if (i < 0) return [...ls, { ...l, qty }];
    const n = [...ls]; n[i] = { ...n[i], qty: Math.min(10, n[i].qty + qty) }; return n;
  });
  const setQty: Ctx['setQty'] = (slug, planId, qty) => setLines((ls) => qty <= 0 ? ls.filter((x) => !(x.slug === slug && x.planId === planId)) : ls.map((x) => (x.slug === slug && x.planId === planId ? { ...x, qty: Math.min(10, qty) } : x)));
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200); };
  return (
    <C.Provider value={{ lines, add, setQty, clear: () => setLines([]), count: lines.reduce((s, l) => s + l.qty, 0), ready, toast, flash }}>
      {children}
      <div className={toast ? 'toast' : 'sr-only'} role="status" aria-live="polite">{toast}</div>
    </C.Provider>
  );
}
export const useCart = () => { const c = useContext(C); if (!c) throw new Error('useCart outside provider'); return c; };

export function CartBadge({ label }: { label: string }) {
  const { count } = useCart();
  return <><span className="lbl">{label}</span>{count > 0 ? <span className="badge num">{count}</span> : null}</>;
}
