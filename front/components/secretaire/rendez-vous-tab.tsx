"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { RendezVous, RendezVousStatut } from "@/types"
import { RendezVousForm } from "@/components/secretaire/rendez-vous-form"
import { Plus, Edit, MoreHorizontal, Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

export function RendezVousTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<RendezVous[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRdv, setEditingRdv] = useState<RendezVous | null>(null)

  const fetchAppointments = useCallback(async () => {
    if (!user?.cabinetId) return

    try {
      const data = await api.getRendezVous(user.cabinetId)
      setAppointments(data)
    } catch (error) {
      console.error("[v0] Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])


const handleCreateRdv = async (data: Partial<RendezVous>) => {
  try {
    if (!user?.cabinetId) throw new Error("cabinetId manquant")
    if (!Number(data.patientId)) return false
    if (!Number(data.medecinId)) return false 
    const payload: Partial<RendezVous> = {
      ...data,
      cabinetId: user.cabinetId,
      patientId: Number(data.patientId),
      medecinId: Number(data.medecinId),
    }

    console.log("CREATE RDV payload =", payload)

    const newRdv = await api.createRendezVous(payload)
    setAppointments((prev) => [newRdv, ...prev])
    setIsDialogOpen(false)
    toast({ title: "Succès", description: "Rendez-vous créé avec succès" })
    return true
  } catch (error) {
    toast({ title: "Erreur", description: "Impossible de créer le rendez-vous", variant: "destructive" })
    return false
  }
}
  const handleUpdateRdv = async (data: Partial<RendezVous>) => {
    if (!editingRdv) return false

    try {
      const updated = await api.updateRendezVous(editingRdv.id, data)
      setAppointments((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setEditingRdv(null)
      toast({
        title: "Succès",
        description: "Rendez-vous mis à jour avec succès",
      })
      return true
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous",
        variant: "destructive",
      })
      return false
    }
  }

const handleChangeStatus = async (id: number, statut: RendezVousStatut) => {
  try {
    await api.updateRendezVousStatut(id, statut)
    await fetchAppointments() // recharge tout avec patient inclus
    toast({ title: "Succès", description: "Statut mis à jour" })
  } catch (error) {
    toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" })
  }
}
  const getStatutBadge = (statut: RendezVousStatut) => {
    const config: Record<
      RendezVousStatut,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      CONFIRME: { variant: "default", label: "Confirmé" },
      EN_ATTENTE: { variant: "secondary", label: "En attente" },
      ANNULE: { variant: "destructive", label: "Annulé" },
      TERMINE: { variant: "outline", label: "Terminé" },
    }
    return <Badge variant={config[statut].variant}>{config[statut].label}</Badge>
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
        <CardTitle>Liste des Rendez-vous</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#70e000] text-black hover:font-bold ">
              <Plus className="mr-1 h-4 w-4" />
              Nouveau Rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouveau Rendez-vous</DialogTitle>
            </DialogHeader>
            <RendezVousForm onSubmit={handleCreateRdv} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Motif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun rendez-vous trouvé
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((rdv) => (
                  <TableRow key={rdv.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(rdv.dateHeure).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rdv.dateHeure).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {rdv.patient ? (
                        `${rdv.patient.prenom} ${rdv.patient.nom}`
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {rdv.motif || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>{getStatutBadge(rdv.statut)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog open={editingRdv?.id === rdv.id} onOpenChange={(open) => !open && setEditingRdv(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingRdv(rdv)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Modifier Rendez-vous</DialogTitle>
                            </DialogHeader>
                            <RendezVousForm rdv={editingRdv || undefined} onSubmit={handleUpdateRdv} />
                          </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleChangeStatus(rdv.id, "CONFIRME")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                              Confirmer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(rdv.id, "EN_ATTENTE")}>
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              En attente
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(rdv.id, "TERMINE")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Terminer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeStatus(rdv.id, "ANNULE")}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
