import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GlobalCart',
  description: 'Your global marketplace for everything.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.variable, "font-body antialiased")}
      >
        <AppProvider>
            <div className="flex flex-col min-h-screen">
              <SiteHeader />
              <main className="flex-1 bg-background/80 backdrop-blur-sm">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
