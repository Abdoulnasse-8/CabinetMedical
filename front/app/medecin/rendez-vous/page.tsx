"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { RendezVous } from "@/types"
import { Calendar, Clock, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

const medecinNavItems = [
  { title: "Tableau de bord", href: "/medecin/dashboard", icon: navIcons.dashboard },
  { title: "Mes Rendez-vous", href: "/medecin/rendez-vous", icon: navIcons.calendar },
]

function RendezVousContent() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<RendezVous[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return

    try {
      const data = await api.getRendezVousAujourdhui(user.id)
      setAppointments(data)
    } catch (error) {
      console.error("[v0] Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      CONFIRME: "default",
      EN_ATTENTE: "secondary",
      ANNULE: "destructive",
      TERMINE: "outline",
    }
    const labels: Record<string, string> = {
      CONFIRME: "Confirmé",
      EN_ATTENTE: "En attente",
      ANNULE: "Annulé",
      TERMINE: "Terminé",
    }
    return <Badge variant={variants[statut] || "outline"}>{labels[statut] || statut}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }


return (
  <div className="min-h-screen bg-gradient-to-b from-[#f5f7f6] to-[#eef3f1]">
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">

      {/* HEADER */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Médecin
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1d3f24]">
          Mes rendez-vous
        </h1>
        <p className="text-sm md:text-base text-[#1d3f24]/70">
          Liste de vos rendez-vous programmés pour aujourd&apos;hui
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="rounded-[2rem] bg-white/70 backdrop-blur border border-slate-200/60 shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
        <div className="p-6 md:p-10">

          {/* CARD HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2D4B23]/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#2D4B23]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1d3f24]">
                  Aujourd&apos;hui
                </h2>
                <p className="text-sm text-slate-600">
                  {appointments.length} rendez-vous
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          {appointments.length === 0 ? (
            <div className="py-20 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-sm text-slate-500">
                Aucun rendez-vous prévu pour aujourd&apos;hui
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((rdv) => (
                <div
                  key={rdv.id}
                  className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100 md:flex-row md:items-center md:justify-between"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#2D4B23]/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#2D4B23]" />
                    </div>

                    <div>
                      <p className="font-medium text-[#1d3f24]">
                        {rdv.patient?.prenom} {rdv.patient?.nom}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(rdv.dateHeure).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {rdv.motif && (
                        <p className="text-sm text-slate-500">
                          {rdv.motif}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    {getStatutBadge(rdv.statut)}

                    {rdv.patient && (
                      <Link href={`/medecin/patient/${rdv.patient.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#2D4B23]/30 text-[#2D4B23] hover:bg-[#2D4B23]/10"
                        >
                          Consulter
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)
}

export default function MedecinRendezVousPage() {
  return (
    <ProtectedRoute allowedRoles={["MEDECIN"]}>
      <DashboardLayout navItems={medecinNavItems}>
        <RendezVousContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
