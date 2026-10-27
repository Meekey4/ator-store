'use client';
/** Small, safe wrappers around localStorage (private mode or blocked storage just returns empty). */
export function readList(key: string): string[] {
  try { const v = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; }
}
export function writeList(key: string, list: string[]) {
  try { localStorage.setItem(key, JSON.stringify(list)); window.dispatchEvent(new Event('ator-local')); } catch { /* ignore */ }
}
export const SAVED = 'ator_saved_v1';
export const RECENT = 'ator_recent_v1';
