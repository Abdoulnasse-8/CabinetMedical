"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Stethoscope, Shield, Lock, User } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-[#f0fdf4] via-[#ecfccb] to-[#d1fae5] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#84cc16]/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#22c55e]/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#10b981]/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Medical Pattern Background */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="medical-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M58 40h4v18h18v4H62v18h-4V62H40v-4h18z"
              fill="#84cc16"
            />
            <path
              d="M10 90h20l6-12 8 20 10-26 6 18h20"
              stroke="#84cc16"
              strokeWidth="2"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#medical-pattern)" />
      </svg>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#84cc16] to-[#22c55e] shadow-lg shadow-[#84cc16]/30 mb-4 transform transition-transform hover:scale-105">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
            Noble Cabinet
          </h1>
          <p className="text-sm text-[#64748b] max-w-md mx-auto">
            Solutions simples pour piloter votre cabinet et votre activité avec clarté
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.15)] p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#84cc16]/10 rounded-full mb-4">
              <Shield className="h-4 w-4 text-[#84cc16]" />
              <span className="text-xs font-semibold text-[#84cc16] uppercase tracking-wider">
                Authentification sécurisée
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-2">
              Connexion
            </h2>
            <p className="text-sm text-[#64748b]">
              Accédez à votre espace professionnel
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 rounded-xl border-red-200 bg-red-50"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-[#0f172a] flex items-center gap-2">
                <User className="h-4 w-4 text-[#84cc16]" />
                Identifiant
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-14 pl-12 rounded-xl bg-[#f8fafc] border-2 border-[#e2e8f0] focus-visible:border-[#84cc16] focus-visible:ring-2 focus-visible:ring-[#84cc16]/20 transition-all text-[#0f172a] placeholder:text-[#94a3b8]"
                  autoComplete="username"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[#0f172a] flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#84cc16]" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-14 pl-12 pr-12 rounded-xl bg-[#f8fafc] border-2 border-[#e2e8f0] focus-visible:border-[#84cc16] focus-visible:ring-2 focus-visible:ring-[#84cc16]/20 transition-all text-[#0f172a] placeholder:text-[#94a3b8]"
                  autoComplete="current-password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#84cc16] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#84cc16] to-[#22c55e] text-white font-semibold text-base hover:from-[#65a30d] hover:to-[#16a34a] shadow-lg shadow-[#84cc16]/30 hover:shadow-xl hover:shadow-[#84cc16]/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#84cc16]" />
                <span>Connexion sécurisée et chiffrée</span>
              </div>
              <Link href="/" className="text-[#84cc16] hover:text-[#65a30d] font-medium transition-colors">
                Retour à l'accueil
              </Link>
            </div>
            <p className="text-center text-xs text-[#94a3b8] mt-4">
              En cas de problème, contactez votre administrateur système
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 p-4 text-center">
          <p className="text-xs text-[#64748b]">
            <span className="font-semibold text-[#0f172a]">Nouveau sur la plateforme ?</span>{" "}
            Contactez votre administrateur pour obtenir vos identifiants d'accès.
          </p>
        </div>
      </div>
    </div>
  );
}
