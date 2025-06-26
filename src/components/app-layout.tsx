
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  Users,
  User,
  LogOut,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/', label: t('Navigation.dashboard'), icon: LayoutDashboard },
    { href: '/revenue', label: t('Navigation.revenue'), icon: TrendingUp },
    { href: '/expenses', label: t('Navigation.expenses'), icon: TrendingDown },
    { href: '/calendar', label: t('Navigation.calendar'), icon: Calendar },
    { href: '/customers', label: t('Navigation.customers'), icon: Users },
  ];

  const footerMenuItems = [
    { href: '/settings', label: t('Navigation.settings'), icon: Settings },
    { href: '/profile', label: t('Navigation.userProfile'), icon: User },
  ];

  const allPages = [...menuItems, ...footerMenuItems];
  const pageTitle = allPages.find((item) => item.href === pathname)?.label || t('Navigation.dashboard');

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">BizSight</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    variant="ghost"
                    className="h-auto w-full justify-start p-2"
                    tooltip={{ children: 'Shad CN', side: 'right' }}
                >
                    <Avatar className="size-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm">Shad CN</span>
                    <span className="text-xs text-muted-foreground">
                        ui@shadcn.com
                    </span>
                    </div>
                </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                    <DropdownMenuItem>
                    <User className="mr-2" />
                    <span>{t('Navigation.userProfile')}</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                    <DropdownMenuItem>
                    <Settings className="mr-2" />
                    <span>{t('Navigation.settings')}</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                    <LogOut className="mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
                <h1 className="text-lg font-semibold">
                    {pageTitle}
                </h1>
            </div>
            <LanguageSwitcher />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
