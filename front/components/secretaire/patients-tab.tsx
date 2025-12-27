"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import type { Patient } from "@/types"
import { PatientForm } from "@/components/secretaire/patient-form"
import { Search, Plus, Edit, Trash2, Send, Loader2 } from "lucide-react"

export function PatientsTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null)

  const fetchPatients = useCallback(async () => {
    if (!user?.cabinetId) return

    try {
      const data = await api.getPatients(user.cabinetId)
      setPatients(data)
    } catch (error) {
      console.error("[v0] Error fetching patients:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleSearch = useCallback(
    async (query: string) => {
      if (!user?.cabinetId) return

      if (!query.trim()) {
        fetchPatients()
        return
      }

      setIsSearching(true)
      try {
        const results = await api.searchPatientsSecretaire(user.cabinetId, query)
        setPatients(results)
      } catch (error) {
        console.error("[v0] Search error:", error)
      } finally {
        setIsSearching(false)
      }
    },
    [user, fetchPatients],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, handleSearch])

  const handleCreatePatient = async (data: Partial<Patient>) => {
    if (!user?.cabinetId) return false

    try {
      const newPatient = await api.createPatient(user.cabinetId, data)
      setPatients((prev) => [newPatient, ...prev])
      setIsDialogOpen(false)
      toast({
        title: "Succès",
        description: "Patient créé avec succès",
      })
      return true
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le patient",
        variant: "destructive",
      })
      return false
    }
  }

  const handleUpdatePatient = async (data: Partial<Patient>) => {
    if (!editingPatient) return false

    try {
      const updated = await api.updatePatient(editingPatient.id, data)
      setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditingPatient(null)
      toast({
        title: "Succès",
        description: "Patient mis à jour avec succès",
      })
      return true
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le patient",
        variant: "destructive",
      })
      return false
    }
  }

  const handleDeletePatient = async () => {
    if (!deletingPatient) return

    try {
      await api.deletePatient(deletingPatient.id)
      setPatients((prev) => prev.filter((p) => p.id !== deletingPatient.id))
      setDeletingPatient(null)
      toast({
        title: "Succès",
        description: "Patient supprimé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le patient",
        variant: "destructive",
      })
    }
  }

  const handleSendToDoctor = async (patient: Patient) => {
    // In a real app, you would select a doctor from a list
    // For now, we'll show a toast
    toast({
      title: "Patient envoyé",
      description: `${patient.prenom} ${patient.nom} a été envoyé au médecin`,
    })
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
        <CardTitle>Liste des Patients</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par CIN ou nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#70e000] text-black hover:font-bold ">
                <Plus className="mr-1 h-4 w-4" />
                Nouveau Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Nouveau Patient</DialogTitle>
              </DialogHeader>
              <PatientForm onSubmit={handleCreatePatient} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CIN</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                <TableHead className="hidden lg:table-cell">Mutuelle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun patient trouvé
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.cin}</TableCell>
                    <TableCell>{patient.nom}</TableCell>
                    <TableCell>{patient.prenom}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.telephone}</TableCell>
                    <TableCell className="hidden lg:table-cell">{patient.typeMutuelle || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendToDoctor(patient)}
                          title="Envoyer au médecin"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={editingPatient?.id === patient.id}
                          onOpenChange={(open) => !open && setEditingPatient(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingPatient(patient)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle>Modifier Patient</DialogTitle>
                            </DialogHeader>
                            <PatientForm patient={editingPatient || undefined} onSubmit={handleUpdatePatient} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingPatient(patient)}
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

      <AlertDialog open={!!deletingPatient} onOpenChange={() => setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le patient {deletingPatient?.prenom} {deletingPatient?.nom} ? Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
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
