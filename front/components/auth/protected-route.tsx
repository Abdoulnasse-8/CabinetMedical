"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/types"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && !hasRole(allowedRoles)) {
      // Redirect to appropriate dashboard based on user role
      switch (user?.role) {
        case "ADMINISTRATEUR":
          router.push("/admin/dashboard")
          break
        case "MEDECIN":
          router.push("/medecin/dashboard")
          break
        case "SECRETAIRE":
          router.push("/secretaire/dashboard")
          break
        default:
          router.push("/login")
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, hasRole, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}
