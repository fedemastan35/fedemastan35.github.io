
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/AppProviders';
import { TopNav } from '@/components/navigation/TopNav';

export const metadata: Metadata = {
  title: 'MealWise',
  description: 'Plan your meals, store recipes, and generate shopping lists with MealWise.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-svh`}>
        <AppProviders>
          <TopNav />
          <main className="container mx-auto px-4 md:px-6 py-6 flex-1 w-full">
            {children}
          </main>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
