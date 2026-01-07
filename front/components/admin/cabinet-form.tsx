"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Cabinet } from "@/types"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"

interface CabinetFormProps {
  cabinet?: Cabinet
  onSubmit: (data: Partial<Cabinet>) => Promise<boolean>
}

export function CabinetForm({ cabinet, onSubmit }: CabinetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(cabinet?.logo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Le backend utilise 'tel' mais le type Cabinet utilise 'telephone', on mappe lors de l'affichage
  const [formData, setFormData] = useState<Partial<Cabinet>>({
    nom: cabinet?.nom || "",
    adresse: cabinet?.adresse || "",
    telephone: (cabinet as any)?.telephone || (cabinet as any)?.tel || "",
    email: cabinet?.email || "",
    specialite: cabinet?.specialite || "",
    logo: cabinet?.logo || "",
  })

  // Fonction pour compresser et redimensionner l'image
  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          // Redimensionner si nécessaire
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Impossible de créer le contexte canvas"))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Convertir en base64 avec compression
          const base64String = canvas.toDataURL("image/jpeg", quality)
          resolve(base64String)
        }
        img.onerror = () => reject(new Error("Erreur lors du chargement de l'image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"))
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image")
      return
    }

    // Vérifier la taille (max 5MB avant compression)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB")
      return
    }

    try {
      // Compresser et redimensionner l'image
      const compressedBase64 = await compressImage(file, 600, 600, 0.7)

      // Vérifier la taille après compression (max ~500KB en base64 = ~375KB réels)
      if (compressedBase64.length > 500 * 1024) {
        // Essayer avec plus de compression
        const moreCompressed = await compressImage(file, 400, 400, 0.6)
        if (moreCompressed.length > 500 * 1024) {
          alert("L'image est trop grande même après compression. Veuillez choisir une image plus petite.")
          return
        }
        setLogoPreview(moreCompressed)
        setFormData((prev) => ({ ...prev, logo: moreCompressed }))
      } else {
        setLogoPreview(compressedBase64)
        setFormData((prev) => ({ ...prev, logo: compressedBase64 }))
      }
    } catch (error) {
      console.error("Error compressing image:", error)
      alert("Erreur lors du traitement de l'image. Veuillez réessayer.")
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setFormData((prev) => ({ ...prev, logo: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Préparer les données - le mapping tel/telephone est fait dans api.ts
    const dataToSend: Partial<Cabinet> = {
      nom: formData.nom?.trim(),
      adresse: formData.adresse?.trim(),
      telephone: formData.telephone?.trim(),
      specialite: formData.specialite?.trim() || undefined,
      logo: formData.logo?.trim() || undefined,
    }

    // Ajouter email seulement s'il existe
    if (formData.email?.trim()) {
      dataToSend.email = formData.email.trim()
    }

    try {
      const success = await onSubmit(dataToSend)
      if (success && !cabinet) {
        // Réinitialiser le formulaire après création réussie
        setFormData({
          nom: "",
          adresse: "",
          telephone: "",
          email: "",
          specialite: "",
          logo: "",
        })
        setLogoPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } finally {
      setIsSubmitting(false)
    }
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

      <div>
        <Label htmlFor="specialite">Spécialité</Label>
        <Input
          id="specialite"
          value={formData.specialite || ""}
          onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
          className="mt-2"
          placeholder="Ex: Généraliste, Ophtalmologue..."
        />
      </div>

      <div>
        <Label htmlFor="logo">Logo du cabinet</Label>
        <div className="mt-2 space-y-3">
          {/* Aperçu du logo */}
          {logoPreview && (
            <div className="relative inline-block">
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Aperçu du logo"
                  className="h-24 w-24 rounded-lg border-2 border-gray-300 object-contain bg-gray-50 p-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Zone d'upload */}
          <div>
            <Input
              ref={fileInputRef}
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {logoPreview ? "Changer le logo" : "Choisir un logo"}
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              Formats acceptés : JPG, PNG, GIF (max 2MB)
            </p>
          </div>
        </div>
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
