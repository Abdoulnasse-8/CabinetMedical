"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Patient } from "@/types"
import { Loader2 } from "lucide-react"

interface PatientFormProps {
  patient?: Patient
  onSubmit: (data: Partial<Patient>) => Promise<boolean>
}

export function PatientForm({ patient, onSubmit }: PatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Patient>>({
    cin: patient?.cin || "",
    nom: patient?.nom || "",
    prenom: patient?.prenom || "",
    dateNaissance: patient?.dateNaissance || "",
    sexe: patient?.sexe || "M",
    telephone: patient?.telephone || "",
    email: patient?.email || "",
    adresse: patient?.adresse || "",
    typeMutuelle: patient?.typeMutuelle || "",
    numeroMutuelle: patient?.numeroMutuelle || "",
    profession: patient?.profession || "",
    antecedents: patient?.antecedents || "",
    allergies: patient?.allergies || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cin">CIN *</Label>
          <Input
            id="cin"
            value={formData.cin}
            onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="sexe">Sexe *</Label>
          <Select value={formData.sexe} onValueChange={(value: "M" | "F") => setFormData({ ...formData, sexe: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Homme</SelectItem>
              <SelectItem value="F">Femme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="dateNaissance">Date de naissance *</Label>
          <Input
            id="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input
            id="telephone"
            type="tel"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="typeMutuelle">Type Mutuelle</Label>
          <Input
            id="typeMutuelle"
            value={formData.typeMutuelle}
            onChange={(e) => setFormData({ ...formData, typeMutuelle: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="numeroMutuelle">Numéro Mutuelle</Label>
          <Input
            id="numeroMutuelle"
            value={formData.numeroMutuelle}
            onChange={(e) => setFormData({ ...formData, numeroMutuelle: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="antecedents">Antécédents</Label>
          <Textarea
            id="antecedents"
            rows={2}
            value={formData.antecedents}
            onChange={(e) => setFormData({ ...formData, antecedents: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            rows={2}
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {patient ? "Mettre à jour" : "Créer le patient"}
        </Button>
      </div>
    </form>
  )
}
