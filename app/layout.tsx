import { Navbar } from '@/components/store/nav';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ecommerce Store - Your One-Stop Shop for Everything',
  description: 'Discover a wide range of products at unbeatable prices. Shop now and enjoy fast shipping and excellent customer service.',
  keywords: ['ecommerce', 'online shopping', 'buy online', 'shop', 'store'],
  authors: [{ name: 'Ecommerce Store' }],
  creator: 'Ecommerce Store Team',
  publisher: 'Ecommerce Store Inc.',
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ecommerce Store - Your One-Stop Shop for Everything',
    description: 'Discover a wide range of products at unbeatable prices. Shop now and enjoy fast shipping and excellent customer service.',
    url: 'https://yourdomain.com',
    siteName: '5G Leuven',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecommerce Store - Your One-Stop Shop for Everything',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Store - Your One-Stop Shop for Everything',
    description: 'Discover a wide range of products at unbeatable prices. Shop now and enjoy fast shipping and excellent customer service.',
    creator: '@yourhandle',
    images: ['https://yourdomain.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'facebook-domain-verification': 'your-facebook-verification-code',
    },
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link
  rel="icon"
  href="favicon.ico"
  type="image/x-icon"
  sizes="32x32"
/>
<link
  rel="icon"
  href="favicon.ico"
  type="image/x-icon"
  sizes="16x16"
/>
<link
  rel="apple-touch-icon"
  href="favicon.ico"
  type="image/x-icon"
  sizes="180x180"
/>
<link
  rel="manifest"
  href="/site.webmanifest"
/>
</head>
      <body className={inter.className}>
        <Navbar />
        {children}</body>
    </html>
  );
}
