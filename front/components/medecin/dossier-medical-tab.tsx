"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { DossierMedical } from "@/types"
import { Save, Edit, X, Loader2 } from "lucide-react"

interface DossierMedicalTabProps {
  dossier: DossierMedical | null
  onUpdate: (dossier: Partial<DossierMedical>) => Promise<boolean>
}

export function DossierMedicalTab({ dossier, onUpdate }: DossierMedicalTabProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<DossierMedical>>({
    groupeSanguin: dossier?.groupeSanguin || "",
    allergies: dossier?.allergies || "",
    antecedentsMedicaux: dossier?.antecedentsMedicaux || "",
    antecedentsChirurgicaux: dossier?.antecedentsChirurgicaux || "",
    antecedentsFamiliaux: dossier?.antecedentsFamiliaux || "",
    traitementEnCours: dossier?.traitementEnCours || "",
    habitudes: dossier?.habitudes || "",
    notes: dossier?.notes || "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    const success = await onUpdate(formData)
    setIsSaving(false)

    if (success) {
      setIsEditing(false)
      toast({
        title: "Succès",
        description: "Le dossier médical a été mis à jour",
      })
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le dossier médical",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      groupeSanguin: dossier?.groupeSanguin || "",
      allergies: dossier?.allergies || "",
      antecedentsMedicaux: dossier?.antecedentsMedicaux || "",
      antecedentsChirurgicaux: dossier?.antecedentsChirurgicaux || "",
      antecedentsFamiliaux: dossier?.antecedentsFamiliaux || "",
      traitementEnCours: dossier?.traitementEnCours || "",
      habitudes: dossier?.habitudes || "",
      notes: dossier?.notes || "",
    })
    setIsEditing(false)
  }

  const fields = [
    { key: "groupeSanguin", label: "Groupe Sanguin", type: "input" },
    { key: "allergies", label: "Allergies", type: "textarea" },
    { key: "antecedentsMedicaux", label: "Antécédents Médicaux", type: "textarea" },
    { key: "antecedentsChirurgicaux", label: "Antécédents Chirurgicaux", type: "textarea" },
    { key: "antecedentsFamiliaux", label: "Antécédents Familiaux", type: "textarea" },
    { key: "traitementEnCours", label: "Traitement en Cours", type: "textarea" },
    { key: "habitudes", label: "Habitudes (tabac, alcool, etc.)", type: "textarea" },
    { key: "notes", label: "Notes", type: "textarea" },
  ] as const

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dossier Médical</CardTitle>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-1" : ""}>
              <Label className="mb-2 block">{field.label}</Label>
              {isEditing ? (
                field.type === "input" ? (
                  <Input
                    value={(formData[field.key] as string) || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  />
                ) : (
                  <Textarea
                    value={(formData[field.key] as string) || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    rows={3}
                  />
                )
              ) : (
                <p className="rounded-md bg-muted p-3 text-sm min-h-[40px]">
                  {(dossier?.[field.key] as string) || (
                    <span className="text-muted-foreground italic">Non renseigné</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
