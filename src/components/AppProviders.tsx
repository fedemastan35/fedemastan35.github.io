"use client";
import type { ReactNode } from 'react';
import { RecipesProvider, ScheduleProvider } from '@/lib/contexts';
import { TooltipProvider } from '@/components/ui/tooltip';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <RecipesProvider>
        <ScheduleProvider>
          {children}
        </ScheduleProvider>
      </RecipesProvider>
    </TooltipProvider>
  );
}
