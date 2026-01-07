"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { RendezVous } from "@/types"
import { Clock, Calendar, CheckCircle, XCircle, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

export function AlertsSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<RendezVous[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    if (!user?.cabinetId) return

    try {
      const data = await api.getRendezVous(user.cabinetId)
      setAppointments(data || [])
    } catch (error) {
      console.error("[AlertsSection] Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.cabinetId])

  useEffect(() => {
    fetchAppointments()
    const interval = setInterval(fetchAppointments, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchAppointments])

  if (isLoading) {
    return null
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // RDV aujourd'hui
  const todayAppointments = appointments.filter((rdv) => {
    const rdvDate = new Date(rdv.dateHeure)
    return rdvDate >= today && rdvDate < tomorrow && rdv.statut !== "ANNULE" && rdv.statut !== "TERMINE"
  })

  // RDV en attente de confirmation
  const pendingAppointments = appointments.filter((rdv) => rdv.statut === "EN_ATTENTE")

  // RDV à venir (prochaines 24h)
  const upcomingAppointments = appointments.filter((rdv) => {
    const rdvDate = new Date(rdv.dateHeure)
    return rdvDate >= now && rdvDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) && rdv.statut !== "ANNULE" && rdv.statut !== "TERMINE"
  })

  // RDV annulés récemment
  const recentCancelled = appointments.filter((rdv) => {
    const rdvDate = new Date(rdv.dateHeure)
    return rdv.statut === "ANNULE" && rdvDate >= today
  })

  const alerts = []

  if (todayAppointments.length > 0) {
    alerts.push({
      type: "today",
      title: `${todayAppointments.length} rendez-vous aujourd'hui`,
      description: `${todayAppointments.filter((r) => r.statut === "CONFIRME").length} confirmé(s), ${todayAppointments.filter((r) => r.statut === "EN_ATTENTE").length} en attente`,
      icon: Calendar,
      color: "bg-blue-50 border-blue-200 text-blue-900",
      iconColor: "text-blue-600",
      count: todayAppointments.length,
    })
  }

  if (pendingAppointments.length > 0) {
    alerts.push({
      type: "pending",
      title: `${pendingAppointments.length} rendez-vous en attente`,
      description: "Nécessitent une confirmation",
      icon: Clock,
      color: "bg-yellow-50 border-yellow-200 text-yellow-900",
      iconColor: "text-yellow-600",
      count: pendingAppointments.length,
    })
  }

  if (upcomingAppointments.length > 0 && todayAppointments.length === 0) {
    alerts.push({
      type: "upcoming",
      title: `${upcomingAppointments.length} rendez-vous à venir`,
      description: "Dans les prochaines 24 heures",
      icon: Bell,
      color: "bg-green-50 border-green-200 text-green-900",
      iconColor: "text-green-600",
      count: upcomingAppointments.length,
    })
  }

  if (recentCancelled.length > 0) {
    alerts.push({
      type: "cancelled",
      title: `${recentCancelled.length} rendez-vous annulé(s)`,
      description: "Aujourd'hui",
      icon: XCircle,
      color: "bg-red-50 border-red-200 text-red-900",
      iconColor: "text-red-600",
      count: recentCancelled.length,
    })
  }

  if (alerts.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Aucune alerte</p>
              <p className="text-sm text-green-700">Tous les rendez-vous sont à jour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => {
        const Icon = alert.icon
        return (
          <Card key={idx} className={`${alert.color} border transition-all hover:shadow-md cursor-pointer`} onClick={() => router.push("/secretaire/rendez-vous")}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 p-2 rounded-lg ${alert.iconColor.replace("text-", "bg-").replace("-600", "-100")}`}>
                    <Icon className={`h-5 w-5 ${alert.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{alert.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {alert.count}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-80">{alert.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  Voir
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

