'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Home, NotebookText, ListChecks, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { ElementType } from 'react';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: ElementType;
  matchStartsWith?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Weekly View', icon: Home, matchStartsWith: true },
  { href: '/recipes', label: 'Recipes', icon: NotebookText, matchStartsWith: true },
  { href: '/shopping-list', label: 'Shopping List', icon: ListChecks },
];

export function TopNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (item: NavItem) => {
    if (item.matchStartsWith) {
      // Handle exact match for '/' specifically, otherwise startsWith for others
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold text-foreground">MealWise</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item) ? "secondary" : "ghost"}
              asChild
              className="font-medium text-sm"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <div className="p-4 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <ChefHat className="h-7 w-7 text-primary" />
                  <span className="text-xl font-semibold text-foreground">MealWise</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={isActive(item) ? "secondary" : "ghost"}
                    asChild
                    className="justify-start text-base py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
