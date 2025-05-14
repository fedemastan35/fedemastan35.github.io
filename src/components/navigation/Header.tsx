"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar"; // Assuming useSidebar is exported
import { ChefHat } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      {isMobile && (
        <>
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MealWise</span>
          </Link>
        </>
      )}
      {!isMobile && <h1 className="text-xl font-semibold">{title}</h1>}
    </header>
  );
}
