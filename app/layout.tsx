import type { Metadata } from "next";
import "./globals.css";
import "./shadcn.css";

export const metadata: Metadata = {
  title: 'SAQR Heritage Exports — Authentic Persian & Arabian Rugs',
  description: 'Handcrafted Persian rugs, Arabian mats, and Iranian collections. Shipped worldwide from Pakistan.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'SAQR Heritage Exports',
    description: 'Authentic Persian & Arabian rugs handcrafted with tradition.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}