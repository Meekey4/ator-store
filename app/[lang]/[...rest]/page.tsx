import { notFound } from 'next/navigation';

/** Any unknown address under /en or /ar shows the store's own 404 page. */
export default function CatchAll() {
  notFound();
}
