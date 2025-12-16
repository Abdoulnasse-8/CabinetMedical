"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Attendre que le chargement soit terminé avant de rediriger
    if (!isLoading && isAuthenticated && user && !redirecting) {
      setRedirecting(true)

      // Déterminer la route selon le rôle
      let targetRoute = "/login"
      switch (user.role) {
        case "ADMINISTRATEUR":
          targetRoute = "/admin/dashboard"
          break
        case "MEDECIN":
          targetRoute = "/medecin/dashboard"
          break
        case "SECRETAIRE":
          targetRoute = "/secretaire/dashboard"
          break
        default:
          // Si le rôle n'est pas reconnu, rester sur la page de login
          setRedirecting(false)
          return
      }

      // Utiliser window.location.href pour forcer la redirection
      if (typeof window !== "undefined") {
        window.location.href = targetRoute
      } else {
        router.push(targetRoute)
      }
    }
  }, [isAuthenticated, user, isLoading, router, redirecting])

  // Afficher un loader pendant le chargement initial
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est authentifié, afficher un loader pendant la redirection
  if (isAuthenticated && user && redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Redirection...</p>
          <p className="text-xs text-muted-foreground">Si la redirection ne fonctionne pas, cliquez <a href={user.role === "ADMINISTRATEUR" ? "/admin/dashboard" : user.role === "MEDECIN" ? "/medecin/dashboard" : "/secretaire/dashboard"} className="text-primary underline">ici</a></p>
        </div>
      </div>
    )
  }

  // Afficher le formulaire de login
  return <LoginForm />
}
