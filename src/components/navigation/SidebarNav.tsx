"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookText, Wand2, ListChecks, Settings, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'; // Assuming sidebar components are in ui

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  matchStartsWith?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Weekly View', icon: Home, matchStartsWith: true },
  { href: '/recipes', label: 'Recipes', icon: NotebookText, matchStartsWith: true },
  { href: '/ai-suggestions', label: 'AI Suggestions', icon: Wand2 },
  { href: '/shopping-list', label: 'Shopping List', icon: ListChecks },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-sidebar-primary" />
          <h1 className="text-2xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            MealWise
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={item.matchStartsWith ? pathname.startsWith(item.href) && (pathname === item.href || pathname.startsWith(item.href + '/')) : pathname === item.href}
                  tooltip={item.label}
                  className={cn(
                    "justify-start w-full",
                    item.matchStartsWith ? pathname.startsWith(item.href) && (pathname === item.href || pathname.startsWith(item.href + '/')) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" :
                    pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0">
        {/* Example Footer Item, can be removed or repurposed */}
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
               className="justify-start w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
    </Sidebar>
  );
}
