import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '太阳系漫游指南 · The Hitchhiker\'s Guide to the Solar System',
  description:
    'An immersive 3D Solar System experience. 太阳系漫游指南 — every planet carries humanity\'s imagination.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-deep text-stardust">{children}</body>
    </html>
  );
}
