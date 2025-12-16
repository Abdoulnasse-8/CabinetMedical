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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mes Rendez-vous</h1>
        <p className="text-muted-foreground">{"Liste de vos rendez-vous du jour"}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {"Aujourd'hui"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{"Aucun rendez-vous prévu pour aujourd'hui"}</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((rdv) => (
                <div key={rdv.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {rdv.patient?.prenom} {rdv.patient?.nom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(rdv.dateHeure).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {rdv.motif && <p className="text-sm text-muted-foreground">{rdv.motif}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatutBadge(rdv.statut)}
                    {rdv.patient && (
                      <Link href={`/medecin/patient/${rdv.patient.id}`}>
                        <Button variant="outline" size="sm">
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
        </CardContent>
      </Card>
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
