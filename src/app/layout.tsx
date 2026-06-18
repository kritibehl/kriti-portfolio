import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kriti Behl | Engineering Investigations',
  description: 'Backend, Platform, and AI Infrastructure engineering portfolio by Kriti Behl.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
