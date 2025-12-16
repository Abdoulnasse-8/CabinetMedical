"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Consultation, Medicament } from "@/types"
import { Save, Loader2, Plus, X } from "lucide-react"

interface NewConsultationTabProps {
  onSubmit: (consultation: Partial<Consultation>) => Promise<boolean>
}

export function NewConsultationTab({ onSubmit }: NewConsultationTabProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [medicamentSearch, setMedicamentSearch] = useState("")
  const [medicamentResults, setMedicamentResults] = useState<Medicament[]>([])
  const [selectedMedicaments, setSelectedMedicaments] = useState<Medicament[]>([])
  const [isSearchingMedicaments, setIsSearchingMedicaments] = useState(false)

  const [formData, setFormData] = useState({
    type: "CONSULTATION" as "CONSULTATION" | "CONTROLE",
    examenClinique: "",
    examenSupplementaire: "",
    diagnostic: "",
    traitement: "",
    observations: "",
  })

  const searchMedicaments = useCallback(async (query: string) => {
    if (!query.trim()) {
      setMedicamentResults([])
      return
    }

    setIsSearchingMedicaments(true)
    try {
      const results = await api.searchMedicaments(query)
      setMedicamentResults(results)
    } catch (error) {
      console.error("[v0] Error searching medicaments:", error)
    } finally {
      setIsSearchingMedicaments(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchMedicaments(medicamentSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [medicamentSearch, searchMedicaments])

  const addMedicament = (medicament: Medicament) => {
    if (!selectedMedicaments.find((m) => m.id === medicament.id)) {
      setSelectedMedicaments([...selectedMedicaments, medicament])
      updateTraitement([...selectedMedicaments, medicament])
    }
    setMedicamentSearch("")
    setMedicamentResults([])
  }

  const removeMedicament = (medicamentId: number) => {
    const updated = selectedMedicaments.filter((m) => m.id !== medicamentId)
    setSelectedMedicaments(updated)
    updateTraitement(updated)
  }

  const updateTraitement = (medicaments: Medicament[]) => {
    const traitementText = medicaments
      .map((m) => `- ${m.nom}${m.dosage ? ` (${m.dosage})` : ""}${m.forme ? ` - ${m.forme}` : ""}`)
      .join("\n")
    setFormData((prev) => ({ ...prev, traitement: traitementText }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await onSubmit({
      ...formData,
      dateConsultation: new Date().toISOString(),
    })

    setIsSubmitting(false)

    if (success) {
      toast({
        title: "Succès",
        description: "La consultation a été enregistrée",
      })
      // Reset form
      setFormData({
        type: "CONSULTATION",
        examenClinique: "",
        examenSupplementaire: "",
        diagnostic: "",
        traitement: "",
        observations: "",
      })
      setSelectedMedicaments([])
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la consultation",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle Consultation</CardTitle>
        <CardDescription>Remplissez les informations de la consultation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Type de consultation</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "CONSULTATION" | "CONTROLE") => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONSULTATION">Consultation</SelectItem>
                <SelectItem value="CONTROLE">Contrôle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Examen Clinique</Label>
            <Textarea
              className="mt-2"
              rows={3}
              placeholder="Décrivez l'examen clinique..."
              value={formData.examenClinique}
              onChange={(e) => setFormData({ ...formData, examenClinique: e.target.value })}
            />
          </div>

          <div>
            <Label>Examen Supplémentaire</Label>
            <Textarea
              className="mt-2"
              rows={3}
              placeholder="Examens complémentaires prescrits (analyses, radios, etc.)..."
              value={formData.examenSupplementaire}
              onChange={(e) => setFormData({ ...formData, examenSupplementaire: e.target.value })}
            />
          </div>

          <div>
            <Label>Diagnostic</Label>
            <Textarea
              className="mt-2"
              rows={3}
              placeholder="Diagnostic..."
              value={formData.diagnostic}
              onChange={(e) => setFormData({ ...formData, diagnostic: e.target.value })}
            />
          </div>

          <div>
            <Label>Traitement</Label>
            <div className="mt-2 space-y-3">
              {/* Medicament Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un médicament..."
                  value={medicamentSearch}
                  onChange={(e) => setMedicamentSearch(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {isSearchingMedicaments && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                )}
                {medicamentResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-lg">
                    {medicamentResults.map((med) => (
                      <button
                        key={med.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent"
                        onClick={() => addMedicament(med)}
                      >
                        <span>
                          {med.nom} {med.dosage && `(${med.dosage})`}
                        </span>
                        <Plus className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Medicaments */}
              {selectedMedicaments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMedicaments.map((med) => (
                    <div key={med.id} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                      <span>{med.nom}</span>
                      <button type="button" onClick={() => removeMedicament(med.id)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Textarea
                rows={4}
                placeholder="Prescription détaillée..."
                value={formData.traitement}
                onChange={(e) => setFormData({ ...formData, traitement: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Observations</Label>
            <Textarea
              className="mt-2"
              rows={3}
              placeholder="Observations et recommandations..."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer la consultation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
