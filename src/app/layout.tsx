import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/cart-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'LUMERA Showcase',
  description: 'Exquisite Fine Gems & Jewels by LUMERA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
