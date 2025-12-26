
"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Building2,
  Pill,
  LogOut,
  Menu,
  Heart,
  UserCircle,
  ChevronRight,
  Bell,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
              isActive
                ? "bg-[#70e000] text-black shadow-[0_10px_25px_rgba(112,224,0,0.35)]"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-transform group-hover:scale-[1.05]",
                isActive ? "text-black" : "text-slate-600"
              )}
            />
            <span className="flex-1">{item.title}</span>
            {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f8f7]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 border border-black/10">
              <Heart className="h-5 w-5 text-slate-900" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-semibold tracking-tight text-slate-900">
                Noble Finance
              </span>
              <p className="text-xs text-slate-500">Cabinet médical</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4">
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
            <NavLinks />
          </nav>

          {/* User card */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#70e000] text-black text-sm font-semibold">
                  {user?.prenom?.[0]}
                  {user?.nom?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur px-4 lg:px-8">
          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 border-r-0">
              <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6 bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 border border-black/10">
                  <Heart className="h-5 w-5 text-slate-900" />
                </div>
                <div className="leading-tight">
                  <span className="text-base font-semibold tracking-tight text-slate-900">
                    Noble Finance
                  </span>
                  <p className="text-xs text-slate-500">Cabinet médical</p>
                </div>
              </div>

              <nav className="p-4 bg-white">
                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Navigation
                </p>
                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              </nav>

              <div className="border-t border-slate-200 p-4 bg-white">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#70e000] text-black text-sm font-semibold">
                      {user?.prenom?.[0]}
                      {user?.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#70e000] ring-2 ring-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-3 px-2 hover:bg-slate-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#70e000] text-black text-xs font-semibold">
                      {user?.prenom?.[0]}
                      {user?.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium text-slate-900 sm:inline-block">
                    {user?.prenom} {user?.nom}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export const navIcons = {
  dashboard: LayoutDashboard,
  users: Users,
  calendar: Calendar,
  fileText: FileText,
  building: Building2,
  pill: Pill,
};
