import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Appzyna — Apps Built in Ghana',
  description: 'Discover apps built in Ghana or turn your website into an app with Appzyna by King Tech.',
  metadataBase: new URL('https://appzyna.online'),
  openGraph: {
    title: 'Appzyna — Apps Built in Ghana',
    description: 'A Ghana-built app store and creator platform by King Tech.',
    url: 'https://appzyna.online',
    siteName: 'Appzyna',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
