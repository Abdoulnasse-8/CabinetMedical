"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Cabinet } from "@/types"
import { Loader2 } from "lucide-react"

interface CabinetFormProps {
  cabinet?: Cabinet
  onSubmit: (data: Partial<Cabinet>) => Promise<boolean>
}

export function CabinetForm({ cabinet, onSubmit }: CabinetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Cabinet>>({
    nom: cabinet?.nom || "",
    adresse: cabinet?.adresse || "",
    telephone: cabinet?.telephone || "",
    email: cabinet?.email || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom du cabinet *</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="adresse">Adresse *</Label>
        <Input
          id="adresse"
          value={formData.adresse}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          required
          className="mt-2"
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
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-2"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {cabinet ? "Mettre à jour" : "Créer le cabinet"}
        </Button>
      </div>
    </form>
  )
}
