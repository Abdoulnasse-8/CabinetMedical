"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Facture, FactureStatut } from "@/types"
import { FactureForm } from "@/components/secretaire/facture-form"
import { Plus, MoreHorizontal, Loader2, CheckCircle, XCircle, Printer } from "lucide-react"

export function FacturesTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [factures, setFactures] = useState<Facture[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [printingFacture, setPrintingFacture] = useState<Facture | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchFactures = useCallback(async () => {
    if (!user?.cabinetId) return

    try {
      const data = await api.getFactures(user.cabinetId)
      setFactures(data)
    } catch (error) {
      console.error("[v0] Error fetching factures:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchFactures()
  }, [fetchFactures])

  const handleCreateFacture = async (data: Partial<Facture>) => {
    try {
      const newFacture = await api.createFacture(data)
      setFactures((prev) => [newFacture, ...prev])
      setIsDialogOpen(false)
      toast({
        title: "Succès",
        description: "Facture créée avec succès",
      })
      return true
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive",
      })
      return false
    }
  }

  const handleChangeStatus = async (id: number, statut: FactureStatut) => {
    try {
      const updated = await api.updateFactureStatut(id, statut)
      setFactures((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
      toast({
        title: "Succès",
        description: "Statut mis à jour",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    }
  }

  const handlePrint = (facture: Facture) => {
    setPrintingFacture(facture)
    setTimeout(() => {
      const printContent = printRef.current
      if (!printContent) return

      const printWindow = window.open("", "_blank")
      if (!printWindow) return

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Facture #${facture.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; color: #2563eb; }
              .info { margin-bottom: 20px; }
              .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2563eb; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.print()
      setPrintingFacture(null)
    }, 100)
  }

  const getStatutBadge = (statut: FactureStatut) => {
    const config: Record<FactureStatut, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      PAYEE: { variant: "default", label: "Payée" },
      EN_ATTENTE: { variant: "secondary", label: "En attente" },
      ANNULEE: { variant: "destructive", label: "Annulée" },
    }
    return <Badge variant={config[statut].variant}>{config[statut].label}</Badge>
  }

  const getModePaiementLabel = (mode?: string) => {
    const labels: Record<string, string> = {
      ESPECES: "Espèces",
      CARTE: "Carte",
      CHEQUE: "Chèque",
      VIREMENT: "Virement",
    }
    return mode ? labels[mode] || mode : "-"
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Liste des Factures</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouvelle Facture</DialogTitle>
              </DialogHeader>
              <FactureForm onSubmit={handleCreateFacture} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="hidden md:table-cell">Mode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune facture trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  factures.map((facture) => (
                    <TableRow key={facture.id}>
                      <TableCell className="font-medium">#{facture.id}</TableCell>
                      <TableCell>
                        {facture.patient ? (
                          `${facture.patient.prenom} ${facture.patient.nom}`
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{facture.montant.toFixed(2)} DH</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getModePaiementLabel(facture.modePaiement)}
                      </TableCell>
                      <TableCell>{getStatutBadge(facture.statut)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(facture.dateFacture).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handlePrint(facture)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleChangeStatus(facture.id, "PAYEE")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                Marquer payée
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangeStatus(facture.id, "ANNULEE")}
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

      {/* Hidden print template */}
      {printingFacture && (
        <div className="hidden">
          <div ref={printRef}>
            <div className="header">
              <div className="title">FACTURE #{printingFacture.id}</div>
            </div>
            <div className="info">
              <div className="info-row">
                <span>Patient:</span>
                <span>
                  {printingFacture.patient?.prenom} {printingFacture.patient?.nom}
                </span>
              </div>
              <div className="info-row">
                <span>Date:</span>
                <span>{new Date(printingFacture.dateFacture).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="info-row">
                <span>Mode de paiement:</span>
                <span>{getModePaiementLabel(printingFacture.modePaiement)}</span>
              </div>
              <div className="info-row">
                <span>Statut:</span>
                <span>
                  {printingFacture.statut === "PAYEE"
                    ? "Payée"
                    : printingFacture.statut === "EN_ATTENTE"
                      ? "En attente"
                      : "Annulée"}
                </span>
              </div>
            </div>
            <div className="total">Total: {printingFacture.montant.toFixed(2)} DH</div>
          </div>
        </div>
      )}
    </>
  )
}
