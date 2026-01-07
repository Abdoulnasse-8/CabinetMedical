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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Cabinet } from "@/types"
import { CabinetForm } from "@/components/admin/cabinet-form"
import { Plus, Edit, Trash2, Loader2, Building2, Users } from "lucide-react"
import { UtilisateursTab } from "@/components/admin/utilisateurs-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CabinetsTab() {
  const { toast } = useToast()
  const [cabinets, setCabinets] = useState<Cabinet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCabinet, setEditingCabinet] = useState<Cabinet | null>(null)
  const [deletingCabinet, setDeletingCabinet] = useState<Cabinet | null>(null)
  const [selectedCabinetForUsers, setSelectedCabinetForUsers] = useState<Cabinet | null>(null)
  const [activeTab, setActiveTab] = useState("cabinets")

  const fetchCabinets = useCallback(async () => {
    try {
      const data = await api.getCabinets()
      setCabinets(data)
    } catch (error) {
      console.error("[v0] Error fetching cabinets:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCabinets()
  }, [fetchCabinets])

  // Basculer vers l'onglet utilisateurs quand un cabinet est sélectionné
  useEffect(() => {
    if (selectedCabinetForUsers) {
      setActiveTab("utilisateurs")
    }
  }, [selectedCabinetForUsers])

  const handleCreateCabinet = async (data: Partial<Cabinet>) => {
    try {
      const newCabinet = await api.createCabinet(data)
      setCabinets((prev) => [newCabinet, ...prev])
      setIsDialogOpen(false)
      toast({
        title: "Succès",
        description: "Cabinet créé avec succès",
      })
      return true
    } catch (error: any) {
      console.error("Error creating cabinet:", error)
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de créer le cabinet",
        variant: "destructive",
      })
      return false
    }
  }

  const handleUpdateCabinet = async (data: Partial<Cabinet>) => {
    if (!editingCabinet) return false

    try {
      const updated = await api.updateCabinet(editingCabinet.id, data)
      setCabinets((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setEditingCabinet(null)
      toast({
        title: "Succès",
        description: "Cabinet mis à jour avec succès",
      })
      return true
    } catch (error: any) {
      console.error("Error updating cabinet:", error)
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour le cabinet",
        variant: "destructive",
      })
      return false
    }
  }

  const handleToggleCabinet = async (cabinet: Cabinet) => {
    try {
      const updated = await api.toggleCabinet(cabinet.id)
      setCabinets((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      toast({
        title: "Succès",
        description: `Cabinet ${updated.actif ? "activé" : "désactivé"}`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCabinet = async () => {
    if (!deletingCabinet) return

    try {
      await api.deleteCabinet(deletingCabinet.id)
      setCabinets((prev) => prev.filter((c) => c.id !== deletingCabinet.id))
      setDeletingCabinet(null)
      toast({
        title: "Succès",
        description: "Cabinet supprimé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cabinet",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestion des Cabinets
          </CardTitle>
          <TabsList>
            <TabsTrigger value="cabinets">Cabinets</TabsTrigger>
            <TabsTrigger value="utilisateurs" disabled={!selectedCabinetForUsers}>
              Utilisateurs
              {selectedCabinetForUsers && ` (${selectedCabinetForUsers.nom})`}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="cabinets" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#70e000] text-black hover:font-bold">
                  <Plus className="mr-1 h-4 w-4" />
                  Nouveau Cabinet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nouveau Cabinet</DialogTitle>
                </DialogHeader>
                <CabinetForm onSubmit={handleCreateCabinet} />
              </DialogContent>
            </Dialog>
          </div>
          <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Adresse</TableHead>
                <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cabinets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun cabinet trouvé
                  </TableCell>
                </TableRow>
              ) : (
                cabinets.map((cabinet) => (
                  <TableRow key={cabinet.id}>
                    <TableCell className="font-medium">{cabinet.nom}</TableCell>
                    <TableCell className="hidden md:table-cell">{cabinet.adresse}</TableCell>
                    <TableCell className="hidden lg:table-cell">{cabinet.telephone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={cabinet.actif} onCheckedChange={() => handleToggleCabinet(cabinet)} />
                        <Badge variant={cabinet.actif ? "default" : "secondary"}>
                          {cabinet.actif ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedCabinetForUsers(cabinet)}
                          title="Gérer les utilisateurs"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={editingCabinet?.id === cabinet.id}
                          onOpenChange={(open) => !open && setEditingCabinet(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingCabinet(cabinet)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Modifier Cabinet</DialogTitle>
                            </DialogHeader>
                            <CabinetForm cabinet={editingCabinet || undefined} onSubmit={handleUpdateCabinet} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCabinet(cabinet)}
                          className="text-destructive hover:text-destructive"
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

          <AlertDialog open={!!deletingCabinet} onOpenChange={() => setDeletingCabinet(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer le cabinet {deletingCabinet?.nom} ? Cette action est irréversible et
                  supprimera toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteCabinet}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
        <TabsContent value="utilisateurs">
          <CardContent>
            {selectedCabinetForUsers && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Gestion des Utilisateurs</h3>
                    <p className="text-sm text-muted-foreground">
                      Cabinet: {selectedCabinetForUsers.nom}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCabinetForUsers(null)}
                  >
                    Retour aux cabinets
                  </Button>
                </div>
                <UtilisateursTab cabinet={selectedCabinetForUsers} />
              </div>
            )}
          </CardContent>
        </TabsContent>
        </Card>
    </Tabs>
  )
}
