"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import type { RendezVous, Patient } from "@/types"
import { Loader2, Search } from "lucide-react"

interface RendezVousFormProps {
  rdv?: RendezVous
  onSubmit: (data: Partial<RendezVous>) => Promise<boolean>
}

export function RendezVousForm({ rdv, onSubmit }: RendezVousFormProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patientSearch, setPatientSearch] = useState("")
  const [patientResults, setPatientResults] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(rdv?.patient || null)
  const [isSearchingPatients, setIsSearchingPatients] = useState(false)

  const [formData, setFormData] = useState({
    dateHeure: rdv?.dateHeure ? new Date(rdv.dateHeure).toISOString().slice(0, 16) : "",
    motif: rdv?.motif || "",
    notes: rdv?.notes || "",
  })

  const searchPatients = useCallback(
    async (query: string) => {
      if (!user?.cabinetId || !query.trim()) {
        setPatientResults([])
        return
      }

      setIsSearchingPatients(true)
      try {
        const results = await api.searchPatientsSecretaire(user.cabinetId, query)
        setPatientResults(results)
      } catch (error) {
        console.error("[v0] Error searching patients:", error)
      } finally {
        setIsSearchingPatients(false)
      }
    },
    [user],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPatients(patientSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [patientSearch, searchPatients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !user?.cabinetId) return

    setIsSubmitting(true)
    await onSubmit({
      ...formData,
      patientId: selectedPatient.id,
      cabinetId: user.cabinetId,
      medecinId: 1, // In a real app, this would be selected
      dateHeure: new Date(formData.dateHeure).toISOString(),
    })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Patient *</Label>
        {selectedPatient ? (
          <div className="mt-2 flex items-center justify-between rounded-md border p-3">
            <span>
              {selectedPatient.prenom} {selectedPatient.nom} ({selectedPatient.cin})
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>
              Changer
            </Button>
          </div>
        ) : (
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="pl-9"
            />
            {isSearchingPatients && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
            )}
            {patientResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-lg">
                {patientResults.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent text-left"
                    onClick={() => {
                      setSelectedPatient(patient)
                      setPatientSearch("")
                      setPatientResults([])
                    }}
                  >
                    <span>
                      {patient.prenom} {patient.nom}
                    </span>
                    <span className="text-muted-foreground">{patient.cin}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="dateHeure">Date et Heure *</Label>
        <Input
          id="dateHeure"
          type="datetime-local"
          value={formData.dateHeure}
          onChange={(e) => setFormData({ ...formData, dateHeure: e.target.value })}
          required
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="motif">Motif</Label>
        <Input
          id="motif"
          value={formData.motif}
          onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-2"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !selectedPatient}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {rdv ? "Mettre à jour" : "Créer le rendez-vous"}
        </Button>
      </div>
    </form>
  )
}
