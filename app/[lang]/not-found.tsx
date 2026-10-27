import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap" style={{ textAlign: 'center', padding: '90px 0' }}>
      <h1 style={{ fontSize: 64 }} className="num">404</h1>
      <p className="muted" style={{ margin: '10px 0 24px' }}>This page doesn’t exist. · هذه الصفحة غير موجودة.</p>
      <Link className="btn primary" href="/">ATOR</Link>
    </div>
  );
}
