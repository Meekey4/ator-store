const L = 'M154.1 30.9 L154.1 123.1 L123.3 123.1 L123.3 92.3 L61.8 92.3 L61.8 61.6 L123.3 61.6 L123.3 30.9 L30.7 30.9 L30.7 123.1 L0 123.1 L0 30.9 L30.7 0.2 L30.7 0 L123.3 0 L123.3 0.3Z M277.7 0 L277.7 30.9 L246.8 30.9 L246.8 123.5 L216 123.5 L216 30.9 L185.1 30.9 L185.1 0Z M493.8 30.9 L493.8 61.8 L586 61.8 L586 123.5 L555.2 123.5 L555.2 92.6 L493.8 92.6 L493.8 123.5 L462.9 123.5 L462.9 0 L586 0 L586 30.9Z';

/** The ATOR wordmark exactly as the master logo: white letters, four gradient pieces for the O. */
export function Logo({ id = 'lg', height = 20 }: { id?: string; height?: number }) {
  return (
    <svg viewBox="0 0 586 124" height={height} role="img" aria-label="ATOR">
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0.4" x2="1" y2="0.6"><stop offset="0" stopColor="#070808" /><stop offset="0.6" stopColor="#3A5F63" /><stop offset="1" stopColor="#1F1A4E" /></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0.55" y2="1"><stop offset="0" stopColor="#1F1A4E" /><stop offset="0.25" stopColor="#3A5F63" /><stop offset="1" stopColor="#070808" /></linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0.4" x2="1" y2="0.6"><stop offset="0" stopColor="#1F1A4E" /><stop offset="0.6" stopColor="#3A5F63" /><stop offset="1" stopColor="#070808" /></linearGradient>
      </defs>
      <path style={{ fill: 'var(--logo-ink, #FFFFFF)' }} d={L} />
      <path fill={`url(#${id}t)`} d="M339.6 0 L339.6 30.8 L431.8 30.8 L401.1 0Z" />
      <path fill={`url(#${id}s)`} d="M308.8 92.3 L308.8 30.8 L339.5 30.8 L339.5 92.3Z" />
      <path fill={`url(#${id}s)`} d="M401.1 92.3 L401.1 30.8 L431.8 30.8 L431.8 92.3Z" />
      <path fill={`url(#${id}b)`} d="M308.8 92.3 L339.5 123 L401.1 123 L401.1 92.3Z" />
    </svg>
  );
}
