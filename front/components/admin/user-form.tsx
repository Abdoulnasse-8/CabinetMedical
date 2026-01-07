"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/types"
import { Loader2 } from "lucide-react"

interface UserFormProps {
  user?: User
  onSubmit: (data: Partial<User>) => Promise<boolean>
}

export function UserForm({ user, onSubmit }: UserFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    login: user?.login || "",
    telephone: user?.telephone || "",
    role: user?.role || "SECRETAIRE",
    signature: user?.signature || "",
    pwd: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Récupérer directement la valeur du champ password depuis le formulaire
    const form = e.currentTarget
    const passwordInput = form.querySelector<HTMLInputElement>('#pwd')
    const passwordValue = passwordInput?.value || formData.pwd || ""

    // Pour la création : le mot de passe est obligatoire
    if (!user) {
      const password = passwordValue.trim()
      if (!password || password.length === 0) {
        toast({
          title: "Erreur de validation",
          description: "Le mot de passe est obligatoire pour créer un nouvel utilisateur",
          variant: "destructive",
        })
        passwordInput?.focus()
        return
      }
    }

    setIsSubmitting(true)

    const dataToSend: Partial<User> = {
      nom: formData.nom?.trim(),
      prenom: formData.prenom?.trim(),
      login: formData.login?.trim(),
      telephone: formData.telephone?.trim(),
      role: formData.role,
      signature: formData.signature?.trim(),
    }

    // Pour la création : le mot de passe est obligatoire
    if (!user) {
      dataToSend.pwd = passwordValue.trim()
    } else {
      // Pour la modification : envoyer le mot de passe seulement s'il est rempli
      const pwd = passwordValue.trim()
      if (pwd.length > 0) {
        dataToSend.pwd = pwd
      }
    }

    try {
      await onSubmit(dataToSend)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="login">Login *</Label>
        <Input
          id="login"
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          required
          disabled={!!user} // Ne pas permettre de modifier le login
          className="mt-2"
        />
        {user && (
          <p className="mt-1 text-xs text-muted-foreground">
            Le login ne peut pas être modifié
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          className="mt-2"
          placeholder="0612345678"
        />
      </div>

      <div>
        <Label htmlFor="role">Rôle *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as User["role"] })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SECRETAIRE">Secrétaire</SelectItem>
            <SelectItem value="MEDECIN">Médecin</SelectItem>
            <SelectItem value="ADMINISTRATEUR">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="signature">Signature</Label>
        <Textarea
          id="signature"
          value={formData.signature}
          onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
          className="mt-2"
          placeholder="Dr. Nom Prénom (pour les médecins)"
          rows={3}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Pour les médecins : signature qui apparaîtra sur les ordonnances
        </p>
      </div>

      <div>
        <Label htmlFor="pwd">
          Mot de passe {!user && "*"}
        </Label>
        <Input
          id="pwd"
          type="password"
          value={formData.pwd || ""}
          onChange={(e) => {
            const newValue = e.target.value
            setFormData((prev) => ({ ...prev, pwd: newValue }))
          }}
          required={!user}
          className="mt-2"
          placeholder={user ? "Laisser vide pour ne pas changer" : "Mot de passe"}
          autoComplete="new-password"
        />
        {user && (
          <p className="mt-1 text-xs text-muted-foreground">
            Laisser vide pour conserver le mot de passe actuel
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {user ? "Mettre à jour" : "Créer l'utilisateur"}
        </Button>
      </div>
    </form>
  )
}


