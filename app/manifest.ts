import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ATOR · Digital subscriptions',
    short_name: 'ATOR',
    description: 'Digital subscriptions and software, delivered fast in Bahrain.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070808',
    theme_color: '#070808',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
