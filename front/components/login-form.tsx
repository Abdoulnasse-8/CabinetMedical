
"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#70e000] relative overflow-hidden">
      {/* Halo soft (optionnel, enlève si tu veux ultra flat) */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-black/10 blur-3xl" />

      {/* Background medical pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="medical-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Medical cross */}
            <path
              d="M58 40h4v18h18v4H62v18h-4V62H40v-4h18z"
              fill="#ffffff"
              fillOpacity="0.6"
            />
            {/* ECG line */}
            <path
              d="M10 90h20l6-12 8 20 10-26 6 18h20"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#medical-pattern)" />
      </svg>

      {/* Card (AU-DESSUS du background) */}
      <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white/90 backdrop-blur border border-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.18)] p-8">
        {/* Brand */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-black/10 border border-black/10 grid place-items-center">
            <span className="font-semibold text-slate-900">NC</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Noble Cabinet 
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Solutions simples pour piloter vos cabinet et votre activité avec clarté.
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-slate-200/70" />

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Authentification
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Se connecter
          </h2>
          <p className="text-sm text-slate-600">
            Accédez à votre espace professionnel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <Alert
              variant="destructive"
              className="rounded-2xl border-destructive/20 bg-destructive/5"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-slate-900">
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
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-900">
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
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-black/10"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          En cas de problème, contactez votre administrateur
        </p>
      </div>
    </div>
  );
}
