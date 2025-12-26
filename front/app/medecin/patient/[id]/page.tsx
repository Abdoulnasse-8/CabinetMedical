
"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { PatientInfo } from "@/components/medecin/patient-info"
import { DossierMedicalTab } from "@/components/medecin/dossier-medical-tab"
import { ConsultationHistoryTab } from "@/components/medecin/consultation-history-tab"
import { NewConsultationTab } from "@/components/medecin/new-consultation-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Patient, DossierMedical, Consultation } from "@/types"
import { ArrowLeft, Loader2 } from "lucide-react"

const medecinNavItems = [
  { title: "Tableau de bord", href: "/medecin/dashboard", icon: navIcons.dashboard },
  { title: "Mes Rendez-vous", href: "/medecin/rendez-vous", icon: navIcons.calendar },
]

function PatientPageContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  // ✅ robust parsing (params.id peut être string | string[])
  const rawId = (params as any)?.id
  const patientId = Number(Array.isArray(rawId) ? rawId[0] : rawId)

  const [patient, setPatient] = useState<Patient | null>(null)
  const [dossier, setDossier] = useState<DossierMedical | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dossier")

  const fetchPatientData = useCallback(async () => {
    // ✅ reset states on id change + invalid id guard
    setIsLoading(true)
    setPatient(null)
    setDossier(null)
    setConsultations([])

    if (!Number.isFinite(patientId) || patientId <= 0) {
      setIsLoading(false)
      return
    }

    let alive = true

    try {
      const [patientData, dossierData, consultationsData] = await Promise.all([
        api.getPatient(patientId),
        api.getDossierMedical(patientId),
        api.getConsultationsPatient(patientId),
      ])

      if (!alive) return

      setPatient(patientData)
      setDossier(dossierData)
      setConsultations(Array.isArray(consultationsData) ? consultationsData : [])
    } catch (error) {
      console.error("[v0] Error fetching patient data:", error)
    } finally {
      if (alive) setIsLoading(false)
    }

    return () => {
      alive = false
    }
  }, [patientId])

  useEffect(() => {
    let cleanup: void | (() => void)

    ;(async () => {
      cleanup = await fetchPatientData()
    })()

    return () => {
      if (typeof cleanup === "function") cleanup()
    }
  }, [fetchPatientData])

  const handleDossierUpdate = async (updatedDossier: Partial<DossierMedical>) => {
    if (!Number.isFinite(patientId) || patientId <= 0) return false

    try {
      const result = await api.updateDossierMedical(patientId, updatedDossier)
      setDossier(result)
      return true
    } catch (error) {
      console.error("[v0] Error updating dossier:", error)
      return false
    }
  }

  const handleNewConsultation = async (consultation: Partial<Consultation>) => {
    if (!user?.id) return false
    if (!Number.isFinite(patientId) || patientId <= 0) return false

    try {
      const newConsultation = await api.createConsultation({
        ...consultation,
        patientId,
        medecinId: user.id,
      })
      setConsultations((prev) => [newConsultation, ...prev])
      setActiveTab("historique")
      return true
    } catch (error) {
      console.error("[v0] Error creating consultation:", error)
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Patient non trouvé</p>
        <Button variant="outline" onClick={() => router.push("/medecin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/medecin/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {patient.prenom} {patient.nom}
          </h1>
          <p className="text-muted-foreground">Dossier patient</p>
        </div>
      </div>

      <PatientInfo patient={patient} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dossier">Dossier Médical</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="nouvelle">Nouvelle Consultation</TabsTrigger>
        </TabsList>
        <TabsContent value="dossier" className="mt-6">
          <DossierMedicalTab dossier={dossier} onUpdate={handleDossierUpdate} />
        </TabsContent>
        <TabsContent value="historique" className="mt-6">
          <ConsultationHistoryTab consultations={consultations} patient={patient} medecin={user} />
        </TabsContent>
        <TabsContent value="nouvelle" className="mt-6">
          <NewConsultationTab onSubmit={handleNewConsultation} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PatientPage() {
  return (
    <ProtectedRoute allowedRoles={["MEDECIN"]}>
      <DashboardLayout navItems={medecinNavItems}>
        <PatientPageContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
