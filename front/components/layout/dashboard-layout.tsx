"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive && "text-primary-foreground",
              )}
            />
            <span className="flex-1">{item.title}</span>
            {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 border-r border-border/50 bg-sidebar lg:block">
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-20 items-center gap-3 border-b border-border/50 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight">MédiCare Pro</span>
              <p className="text-xs text-muted-foreground">Cabinet médical</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</p>
            <NavLinks />
          </nav>

          {/* User Card */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-accent/50 px-4 py-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-medium">
                  {user?.prenom?.[0]}
                  {user?.nom?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-accent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-r-0">
              <div className="flex h-20 items-center gap-3 border-b border-border/50 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold">MédiCare Pro</span>
              </div>
              <nav className="p-4">
                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 px-2 hover:bg-accent">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                      {user?.prenom?.[0]}
                      {user?.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium sm:inline-block">
                    {user?.prenom} {user?.nom}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-card">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export const navIcons = {
  dashboard: LayoutDashboard,
  users: Users,
  calendar: Calendar,
  fileText: FileText,
  building: Building2,
  pill: Pill,
}
