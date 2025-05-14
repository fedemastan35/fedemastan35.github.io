
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/AppProviders';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/navigation/SidebarNav';

// The GeistSans and GeistMono imports are objects, not functions to be called.
// Their .variable properties can be used directly.
// The 'variable' and 'subsets' options are typically handled by the geist package itself.

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
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AppProviders>
          <SidebarProvider defaultOpen={true}>
            <SidebarNav />
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
