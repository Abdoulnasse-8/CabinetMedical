"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { DashboardStats, RendezVous, Patient } from "@/types"
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Bell,
  Loader2,
  TrendingUp,
  Activity,
} from "lucide-react"

const medecinNavItems = [
  { title: "Tableau de bord", href: "/medecin/dashboard", icon: navIcons.dashboard },
  { title: "Mes Rendez-vous", href: "/medecin/rendez-vous", icon: navIcons.calendar },
]

function DoctorDashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todayAppointments, setTodayAppointments] = useState<RendezVous[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user?.cabinetId || !user?.id) return

    try {
      const [statsData, appointmentsData, patientData] = await Promise.all([
        api.getMedecinDashboard(user.cabinetId, user.id),
        api.getRendezVousAujourdhui(user.id),
        api.getPatientEnCours(user.id),
      ])

      setStats(statsData)
      setTodayAppointments(appointmentsData)
      setCurrentPatient(patientData)
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (currentPatient) {
      toast({
        title: "Patient en cours",
        description: `${currentPatient.prenom} ${currentPatient.nom} est prêt pour la consultation`,
      })
    }
  }, [currentPatient, toast])

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query)
      if (!query.trim() || !user?.cabinetId) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await api.searchPatientsMedecin(user.cabinetId, query)
        setSearchResults(results)
      } catch (error) {
        console.error("[v0] Search error:", error)
      } finally {
        setIsSearching(false)
      }
    },
    [user],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, handleSearch])

  const getStatutBadge = (statut: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className: string }
    > = {
      CONFIRME: { variant: "default", label: "Confirmé", className: "bg-primary/10 text-primary border-primary/20" },
      EN_ATTENTE: {
        variant: "secondary",
        label: "En attente",
        className: "bg-warning/10 text-warning border-warning/20",
      },
      ANNULE: {
        variant: "destructive",
        label: "Annulé",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
      TERMINE: { variant: "outline", label: "Terminé", className: "bg-muted text-muted-foreground" },
    }
    const { label, className } = config[statut] || { label: statut, className: "" }
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, <span className="text-gradient">Dr. {user?.nom}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Voici un aperçu de votre journée du{" "}
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        {currentPatient && (
          <Card className="border-primary/20 bg-primary/5 shadow-soft animate-in slide-in-from-right duration-300">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">Patient en attente</p>
                <p className="text-sm text-muted-foreground">
                  {currentPatient.prenom} {currentPatient.nom}
                </p>
              </div>
              <Link href={`/medecin/patient/${currentPatient.id}`}>
                <Button className="gradient-primary shadow-soft hover:opacity-90">Consulter</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalPatients || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              Patients enregistrés
            </p>
          </CardContent>
        </Card>

        <Card className="group shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consultations</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
              <Stethoscope className="h-5 w-5 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalConsultations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Activity className="h-3 w-3 text-chart-2" />
              Total effectuées
            </p>
          </CardContent>
        </Card>

        <Card className="group shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"RDV Aujourd'hui"}</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10 group-hover:bg-chart-3/20 transition-colors">
              <Calendar className="h-5 w-5 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.rendezVousAujourdhui || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Rendez-vous programmés</p>
          </CardContent>
        </Card>

        <Card className="group shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Consult. Aujourd'hui"}</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/10 group-hover:bg-chart-4/20 transition-colors">
              <Clock className="h-5 w-5 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.consultationsAujourdhui || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Consultations terminées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient Search */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Rechercher un Patient
            </CardTitle>
            <CardDescription>Recherche rapide par nom, prénom ou CIN</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tapez pour rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-secondary/30 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            {isSearching && (
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/medecin/patient/${patient.id}`}
                    className="group flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {patient.prenom?.[0]}
                        {patient.nom?.[0]}
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {patient.prenom} {patient.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">CIN: {patient.cin}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <p className="mt-4 text-center text-sm text-muted-foreground py-4">Aucun patient trouvé</p>
            )}
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {"Rendez-vous du Jour"}
            </CardTitle>
            <CardDescription>{todayAppointments.length} rendez-vous programmés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">{"Aucun rendez-vous prévu aujourd'hui"}</p>
                </div>
              ) : (
                todayAppointments.map((rdv, index) => (
                  <div
                    key={rdv.id}
                    className="group flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-accent/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Clock className="h-5 w-5 text-primary" />
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
                          {rdv.motif && ` • ${rdv.motif}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatutBadge(rdv.statut)}
                      {rdv.patient && (
                        <Link href={`/medecin/patient/${rdv.patient.id}`}>
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["MEDECIN"]}>
      <DashboardLayout navItems={medecinNavItems}>
        <DoctorDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
