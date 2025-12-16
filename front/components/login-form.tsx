"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Heart, Shield, Activity } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">MédiCare Pro</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance">
                La gestion médicale
                <br />
                <span className="text-white/90">réinventée</span>
              </h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed max-w-md">
                Une plateforme intuitive conçue pour simplifier votre quotidien et améliorer la prise en charge de vos
                patients.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <Shield className="h-5 w-5 text-white/90" />
                <span className="text-sm font-medium">Données sécurisées</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <Activity className="h-5 w-5 text-white/90" />
                <span className="text-sm font-medium">Temps réel</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60">© 2025 MédiCare Pro. Tous droits réservés.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 gradient-subtle">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-soft">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">MédiCare Pro</h1>
            <p className="mt-1 text-muted-foreground">Gestion de Cabinet Médical</p>
          </div>

          <div className="hidden lg:block text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenue</h2>
            <p className="mt-2 text-muted-foreground">Connectez-vous à votre espace professionnel</p>
          </div>

          <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Identifiant
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Entrez votre identifiant"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium gradient-primary hover:opacity-90 transition-opacity shadow-soft"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            En cas de problème, contactez votre administrateur
          </p>
        </div>
      </div>
    </div>
  )
}
