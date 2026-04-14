import type { Metadata } from 'next';
import './../styles/globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FARCRYSTAL - AI Powered Mini App',
  description: 'Launch tokens with AI agents on Farcaster',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
