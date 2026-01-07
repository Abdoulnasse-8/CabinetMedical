
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

type Summary =
  | {
      role: "MEDECIN"
      count: number
      patientLabel?: string
      rendezVous?: any[]
      prochainRdv?: any | null
    }
  | {
      role: "SECRETAIRE"
      count: number
      enAttente?: number
      rendezVous?: any[]
    }
  | {
      role: "ADMIN"
      count: number
      rendezVous?: any[]
    }
  | any

export function NotificationBell() {
  const router = useRouter()
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [patientEnCours, setPatientEnCours] = useState<any | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const s = await api.getNotificationsSummary()
      setSummary(s)
      setCount(Number(s?.count ?? 0))

      // Charger le patient en cours pour les médecins
      if (user?.role === "MEDECIN" && user?.id) {
        try {
          const patientData = await api.getPatientEnCours(user.id)
          setPatientEnCours(patientData)
        } catch (e) {
          console.log("Error loading patient en cours:", e)
          setPatientEnCours(null)
        }
      }
    } catch (e) {
      console.log("notif error", e)
    } finally {
      setLoading(false)
    }
  }, [user?.role, user?.id])

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [load])

  const role = summary?.role as string | undefined

  const headerRightBadge = useMemo(() => {
    if (count <= 0) return null
    return (
      <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-slate-900 text-white text-xs px-2">
        {count}
      </span>
    )
  }, [count])

  // Labels affichés selon rôle
  const line1Label = useMemo(() => {
    if (role === "MEDECIN") return "Patient en attente"
    if (role === "SECRETAIRE") return "RDV en attente"
    return "Notifications"
  }, [role])

  const line1Value = useMemo(() => {
    if (role === "MEDECIN") {
      // Prioriser le patient en cours depuis l'API dédiée
      if (patientEnCours) {
        return `${patientEnCours.prenom} ${patientEnCours.nom}`
      }
      return summary?.patientLabel ?? "Aucun"
    }
    if (role === "SECRETAIRE") return String(summary?.enAttente ?? 0)
    return "—"
  }, [role, summary, patientEnCours])

  const line2Value = useMemo(() => {
    // compteur RDV du jour (médecin ou cabinet)
    return String(summary?.count ?? 0)
  }, [summary])

  const list = useMemo(() => {
    const arr = summary?.rendezVous ?? []
    return Array.isArray(arr) ? arr.slice(0, 2) : []
  }, [summary])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 rounded-xl"
          onClick={load}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bell className="h-5 w-5" />}

          {/* Point vert */}
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#70e000] ring-2 ring-white" />

          {/* Badge */}
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full px-1 text-xs flex items-center justify-center bg-[#346801] text-white">
              {count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-0">
        {/* Header */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">
                {role ? role.toLowerCase() : "Aujourd’hui"}
              </p>
            </div>
            {headerRightBadge}
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        {/* Ligne 1 - Patient en cours pour médecin */}
        {role === "MEDECIN" && patientEnCours ? (
          <button
            type="button"
            className="w-full px-3 py-2 text-left hover:bg-slate-50 transition flex items-start justify-between gap-3"
            onClick={() => router.push(`/medecin/patient/${patientEnCours.id}`)}
          >
            <div className="min-w-0">
              <p className="text-xs text-slate-500">{line1Label}</p>
              <p className="text-sm font-medium text-slate-900 truncate">{line1Value}</p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">Consulter →</span>
          </button>
        ) : (
          <button
            type="button"
            className="w-full px-3 py-2 text-left hover:bg-slate-50 transition flex items-start justify-between gap-3"
            onClick={load}
          >
            <div className="min-w-0">
              <p className="text-xs text-slate-500">{line1Label}</p>
              <p className="text-sm font-medium text-slate-900 truncate">{line1Value}</p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {role === "MEDECIN" && summary?.prochainRdv?.heureRdv
                ? String(summary.prochainRdv.heureRdv).slice(0, 5)
                : ""}
            </span>
          </button>
        )}

        <div className="h-px bg-slate-200" />

        {/* Ligne 2 */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">RDV aujourd’hui</p>
            <p className="text-sm font-medium text-slate-900">{line2Value}</p>
          </div>

          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#70e000]" />
            En ligne
          </span>
        </div>

        {/* Liste (2 items) */}
        {list.length > 0 ? (
          <>
            <div className="h-px bg-slate-200" />
            <div className="px-3 py-2">
              <p className="text-xs text-slate-500 mb-2">Prochains RDV</p>
              <div className="space-y-1">
                {list.map((r: any) => (
                  <div
                    key={r.idRendezVous ?? r.id}
                    className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-slate-50"
                  >
                    <p className="text-sm text-slate-900 truncate max-w-[210px]">
                      {r.patient?.prenom ? `${r.patient.prenom} ${r.patient.nom}` : "—"}
                    </p>
                    <p className="text-xs text-slate-500">{String(r.heureRdv ?? "").slice(0, 5)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div className="h-px bg-slate-200" />

        {/* Footer */}
        <button
          type="button"
          className="w-full px-3 py-2 text-left hover:bg-slate-50 transition text-sm text-slate-700"
          onClick={load}
        >
          Actualiser
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
