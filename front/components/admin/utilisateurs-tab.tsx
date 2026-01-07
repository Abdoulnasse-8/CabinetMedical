"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { User, Cabinet } from "@/types"
import { UserForm } from "@/components/admin/user-form"
import { Plus, Edit, Trash2, Loader2, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UtilisateursTabProps {
  cabinet: Cabinet | null
}

export function UtilisateursTab({ cabinet }: UtilisateursTabProps) {
  const { toast } = useToast()
  const { user: currentUser } = useAuth()
  const [utilisateurs, setUtilisateurs] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const fetchUtilisateurs = useCallback(async () => {
    if (!cabinet?.id) {
      setIsLoading(false)
      return
    }

    try {
      const data = await api.getUtilisateursByCabinet(cabinet.id)
      setUtilisateurs(data)
    } catch (error) {
      console.error("Error fetching utilisateurs:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [cabinet?.id, toast])

  useEffect(() => {
    fetchUtilisateurs()
  }, [fetchUtilisateurs])

  const handleCreateUser = async (data: Partial<User>) => {
    if (!cabinet?.id) {
      toast({
        title: "Erreur",
        description: "Aucun cabinet sélectionné",
        variant: "destructive",
      })
      return false
    }

    try {
      const newUser = await api.createUtilisateur(cabinet.id, data)
      setUtilisateurs((prev) => [newUser, ...prev])
      setIsDialogOpen(false)
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      })
      return true
    } catch (error: any) {
      console.error("Error creating user:", error)
      const errorMessage = error?.message || "Impossible de créer l'utilisateur"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const handleUpdateUser = async (data: Partial<User>) => {
    if (!editingUser || !cabinet?.id) return false

    try {
      const updated = await api.updateUtilisateur(cabinet.id, editingUser.id, data)
      setUtilisateurs((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      setEditingUser(null)
      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
      })
      return true
    } catch (error: any) {
      console.error("Error updating user:", error)
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour l'utilisateur",
        variant: "destructive",
      })
      return false
    }
  }

  const handleDeleteUser = async () => {
    if (!deletingUser || !cabinet?.id) return

    try {
      await api.deleteUtilisateur(cabinet.id, deletingUser.id)
      setUtilisateurs((prev) => prev.filter((u) => u.id !== deletingUser.id))
      setDeletingUser(null)
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      })
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMINISTRATEUR":
        return "default"
      case "MEDECIN":
        return "secondary"
      case "SECRETAIRE":
        return "outline"
      default:
        return "outline"
    }
  }

  if (!cabinet) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Veuillez sélectionner un cabinet pour gérer ses utilisateurs</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Utilisateurs du Cabinet: {cabinet.nom}
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#70e000] text-black hover:font-bold">
              <Plus className="mr-1 h-4 w-4" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvel Utilisateur</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleCreateUser} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Login</TableHead>
                <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilisateurs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                utilisateurs.map((utilisateur) => (
                  <TableRow key={utilisateur.id}>
                    <TableCell className="font-medium">
                      {utilisateur.prenom} {utilisateur.nom}
                    </TableCell>
                    <TableCell>{utilisateur.login}</TableCell>
                    <TableCell className="hidden md:table-cell">{utilisateur.telephone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(utilisateur.role)}>
                        {utilisateur.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={utilisateur.actif ? "default" : "secondary"}>
                        {utilisateur.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog
                          open={editingUser?.id === utilisateur.id}
                          onOpenChange={(open) => !open && setEditingUser(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingUser(utilisateur)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Modifier Utilisateur</DialogTitle>
                            </DialogHeader>
                            <UserForm user={editingUser || undefined} onSubmit={handleUpdateUser} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingUser(utilisateur)}
                          className="text-destructive hover:text-destructive"
                          disabled={
                            currentUser?.id === utilisateur.id ||
                            (utilisateur.role === "ADMINISTRATEUR" &&
                              utilisateurs.filter((u) => u.role === "ADMINISTRATEUR").length <= 1)
                          }
                          title={
                            currentUser?.id === utilisateur.id
                              ? "Vous ne pouvez pas supprimer votre propre compte"
                              : utilisateur.role === "ADMINISTRATEUR" &&
                                utilisateurs.filter((u) => u.role === "ADMINISTRATEUR").length <= 1
                              ? "Impossible de supprimer le dernier administrateur"
                              : "Supprimer"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur {deletingUser?.prenom}{" "}
              {deletingUser?.nom} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}


