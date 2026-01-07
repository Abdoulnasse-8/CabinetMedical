"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
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
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const medecinNavItems = [
  { title: "Tableau de bord", href: "/medecin/dashboard", icon: navIcons.dashboard },
  { title: "Mes Rendez-vous", href: "/medecin/rendez-vous", icon: navIcons.calendar },
]

function DoctorDashboardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todayAppointments, setTodayAppointments] = useState<RendezVous[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)

  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  // ✅ Interactivité ajoutée
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [rdvFilter, setRdvFilter] = useState<"TOUS" | "CONFIRME" | "EN_ATTENTE" | "ANNULE" | "TERMINE">("TOUS")
  const [showAllRdv, setShowAllRdv] = useState(true)
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  // ✅ Anti-race condition (search)
  const searchReqIdRef = useRef(0)

  const fetchData = useCallback(async () => {
    if (!user?.cabinetId || !user?.id) return

    try {
      const [statsData, appointmentsData, patientData] = await Promise.all([
        api.getMedecinDashboard(user.cabinetId, user.id),
        api.getRendezVousAujourdhui(),
        api.getPatientEnCours(user.id).catch(() => null), // Ne pas bloquer si erreur
      ])

      setStats(statsData)
      setTodayAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
      setCurrentPatient(patientData)
      setLastUpdatedAt(new Date())
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [user?.cabinetId, user?.id, toast])

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
      if (!query.trim() || !user?.cabinetId) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      const reqId = ++searchReqIdRef.current
      setIsSearching(true)

      try {
        const results = await api.searchPatientsMedecin(user.cabinetId, query)
        // ignore réponses anciennes
        if (reqId !== searchReqIdRef.current) return
        setSearchResults(Array.isArray(results) ? results : [])
      } catch (error) {
        console.error("[v0] Search error:", error)
        if (reqId !== searchReqIdRef.current) return
        setSearchResults([])
      } finally {
        if (reqId === searchReqIdRef.current) setIsSearching(false)
      }
    },
    [user?.cabinetId],
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

  const filteredAppointments = useMemo(() => {
    if (rdvFilter === "TOUS") return todayAppointments
    return todayAppointments.filter((r) => r.statut === rdvFilter)
  }, [todayAppointments, rdvFilter])

  const visibleAppointments = useMemo(() => {
    if (showAllRdv) return filteredAppointments
    return filteredAppointments.slice(0, 5)
  }, [filteredAppointments, showAllRdv])

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
  }

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusIndex((prev) => Math.min(prev + 1, searchResults.length - 1))
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusIndex((prev) => Math.max(prev - 1, 0))
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      const idx = focusIndex >= 0 ? focusIndex : 0
      const p = searchResults[idx]
      if (p?.id) router.push(`/medecin/patient/${p.id}`)
      return
    }
    if (e.key === "Escape") {
      setSearchQuery("")
      setSearchResults([])
      setFocusIndex(-1)
    }
  }

  useEffect(() => {
    // reset focus quand la liste change
    setFocusIndex(-1)
  }, [searchResults])

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
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7f6] to-[#eef3f1]">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
        {/* HEADER / HERO */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tableau de bord</p>

            <h1 className="text-3xl md:text-4xl font-semibold text-[#1d3f24]">Bonjour, Dr. {user?.nom}</h1>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm md:text-base text-[#1d3f24]/70">
                Voici un aperçu de votre journée du{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>

              {lastUpdatedAt && (
                <span className="text-xs text-slate-500">
                  Mis à jour à{" "}
                  {lastUpdatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-full bg-white/70 backdrop-blur border border-slate-200/60"
            >
              {isRefreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Actualiser
            </Button>

            {currentPatient && (
              <div className="flex items-center gap-4 rounded-[1.75rem] bg-white/70 backdrop-blur border border-[#1d3f24]/10 shadow-lg p-4">
                <div className="h-12 w-12 rounded-xl bg-[#2D4B23]/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-[#2D4B23]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1d3f24]">Patient en attente</p>
                  <p className="text-sm text-[#1d3f24]/70">
                    {currentPatient.prenom} {currentPatient.nom}
                  </p>
                </div>
                <Link href={`/medecin/patient/${currentPatient.id}`}>
                  <Button className="rounded-full bg-[#2D4B23] px-4 py-2 text-white shadow-md hover:bg-[#243C1C]">
                    Consulter
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Patients", value: stats?.totalPatients || 0, icon: Users },
            { title: "Consultations", value: stats?.totalConsultations || 0, icon: Stethoscope },
            { title: "RDV aujourd’hui", value: stats?.rendezVousAujourdhui || 0, icon: Calendar },
            { title: "Consult. terminées", value: stats?.consultationsAujourdhui || 0, icon: Clock },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-[1.75rem] bg-white/70 backdrop-blur border border-slate-200/60 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (item.title.includes("RDV")) router.push("/medecin/rendez-vous")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && item.title.includes("RDV")) router.push("/medecin/rendez-vous")
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{item.title}</p>
                <div className="h-10 w-10 rounded-xl bg-[#2D4B23]/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[#2D4B23]" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-[#1d3f24]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* SEARCH PATIENT */}
          <div className="rounded-[2rem] bg-white/70 backdrop-blur border border-slate-200/60 shadow-lg p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#1d3f24]">Rechercher un patient</h2>
              {(searchQuery || searchResults.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults([])
                    setFocusIndex(-1)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Effacer
                </Button>
              )}
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Nom, prénom ou CIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={onSearchKeyDown}
                className="h-12 rounded-full bg-slate-100 pl-11 pr-10 border-none focus:ring-2 focus:ring-[#2D4B23]/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Vider la recherche"
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults([])
                    setFocusIndex(-1)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {isSearching && (
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[#2D4B23]" />
              </div>
            )}

            {!isSearching && searchQuery.trim() && searchResults.length === 0 && (
              <p className="mt-4 text-sm text-slate-500 text-center">Aucun résultat</p>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((patient, idx) => (
                  <Link
                    key={patient.id}
                    href={`/medecin/patient/${patient.id}`}
                    className={[
                      "flex items-center justify-between rounded-xl p-4 transition",
                      idx === focusIndex ? "bg-slate-200/60" : "bg-slate-50 hover:bg-slate-100",
                    ].join(" ")}
                    onMouseEnter={() => setFocusIndex(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#2D4B23]/10 flex items-center justify-center text-sm font-medium text-[#2D4B23]">
                        {patient.prenom?.[0]}
                        {patient.nom?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {patient.prenom} {patient.nom}
                        </p>
                        <p className="text-sm text-slate-500">CIN: {patient.cin}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
                <p className="text-xs text-slate-500 pt-2">
                  Astuces: ↑ ↓ pour naviguer, Entrée pour ouvrir, Échap pour fermer.
                </p>
              </div>
            )}
          </div>

          {/* RDV DU JOUR */}
          <div className="rounded-[2rem] bg-white/70 backdrop-blur border border-slate-200/60 shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#1d3f24]">Rendez-vous du jour</h2>

              <div className="flex flex-wrap gap-2">
                {(["TOUS", "CONFIRME", "EN_ATTENTE", "TERMINE", "ANNULE"] as const).map((k) => (
                  <Button
                    key={k}
                    variant={rdvFilter === k ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setRdvFilter(k)}
                  >
                    {k === "TOUS"
                      ? "Tous"
                      : k === "CONFIRME"
                        ? "Confirmés"
                        : k === "EN_ATTENTE"
                          ? "En attente"
                          : k === "TERMINE"
                            ? "Terminés"
                            : "Annulés"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {filteredAppointments.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Aucun rendez-vous pour ce filtre</p>
              ) : (
                <>
                  {visibleAppointments.map((rdv) => (
                    <div
                      key={rdv.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-4 hover:bg-slate-100 transition cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        const pid = rdv.patient?.id
                        if (pid) router.push(`/medecin/patient/${pid}`)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const pid = rdv.patient?.id
                          if (pid) router.push(`/medecin/patient/${pid}`)
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#2D4B23]/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-[#2D4B23]" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {rdv.patient?.prenom} {rdv.patient?.nom}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(rdv.dateHeure).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      {getStatutBadge(rdv.statut)}
                    </div>
                  ))}

                  {filteredAppointments.length > 5 && (
                    <Button
                      variant="ghost"
                      className="w-full rounded-xl"
                      onClick={() => setShowAllRdv((v) => !v)}
                    >
                      {showAllRdv ? (
                        <>
                          <ChevronUp className="mr-2 h-4 w-4" /> Afficher moins
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" /> Afficher plus ({filteredAppointments.length - 5})
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
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
