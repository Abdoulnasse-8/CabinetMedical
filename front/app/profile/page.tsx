
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateUser, logout } = useAuth()
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    nom: user?.nom ?? "",
    prenom: user?.prenom ?? "",
    login: user?.login ?? "",
  })

  // ✅ si user change (après updateUser), on resynchronise le form
  useEffect(() => {
    setForm({
      nom: user?.nom ?? "",
      prenom: user?.prenom ?? "",
      login: user?.login ?? "",
    })
  }, [user?.nom, user?.prenom, user?.login])

  const onSave = async () => {
    if (!form.nom.trim() || !form.prenom.trim()) {
      toast({ title: "Erreur", description: "Nom et prénom sont obligatoires", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const updated = await api.updateMyProfile({ nom: form.nom.trim(), prenom: form.prenom.trim() })

      // ✅ met à jour l’état local (header, avatar, etc.)
      updateUser({ nom: updated.nom, prenom: updated.prenom })

      toast({ title: "Succès", description: "Profil mis à jour. Veuillez vous reconnecter." })

      // ✅ Re-auth à zéro : déconnexion + retour login
      // (logout fait déjà le push vers /login)
      logout()
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e?.message ?? "Impossible de mettre à jour le profil",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header page */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Mon profil</h1>
            <p className="text-sm text-slate-500">Modifier vos informations personnelles</p>
          </div>

          <Button variant="ghost" className="hover:bg-slate-100" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Informations</CardTitle>
            <CardDescription>Votre login ne peut pas être modifié.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <Label className="text-slate-700">Login</Label>
              <Input value={form.login} disabled className="mt-2 bg-slate-50 border-slate-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700">Prénom</Label>
                <Input
                  className="mt-2 border-slate-200"
                  value={form.prenom}
                  onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-slate-700">Nom</Label>
                <Input
                  className="mt-2 border-slate-200"
                  value={form.nom}
                  onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500">
                Après l’enregistrement, vous serez redirigé vers la page de connexion.
              </p>

              <Button
                onClick={onSave}
                disabled={isSaving}
                className="bg-[#70e000] text-black hover:font-bold rounded-xl"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
