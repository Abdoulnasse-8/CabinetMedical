"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Medicament } from "@/types"
import { Search, Plus, Loader2, Pill, Upload } from "lucide-react"

export function MedicamentsTab() {
  const { toast } = useToast()
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isBatchAdding, setIsBatchAdding] = useState(false)
  const [batchInput, setBatchInput] = useState("")
  const [showBatchForm, setShowBatchForm] = useState(false)

  const fetchMedicaments = useCallback(async () => {
    try {
      const data = await api.getMedicaments()
      setMedicaments(data)
    } catch (error) {
      console.error("[v0] Error fetching medicaments:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedicaments()
  }, [fetchMedicaments])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setMedicaments([])
      return
    }

    setIsSearching(true)
    try {
      const results = await api.searchMedicaments(query)
      setMedicaments(results)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        handleSearch(searchQuery)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      fetchMedicaments()
    }
  }, [searchQuery, handleSearch, fetchMedicaments])

  const handleBatchAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!batchInput.trim()) return

    setIsBatchAdding(true)

    try {
      // Parse batch input - each line is a medicament: nom, forme, dosage
      const lines = batchInput.split("\n").filter((line) => line.trim())
      const newMedicaments = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim())
        return {
          nom: parts[0] || "",
          forme: parts[1] || "",
          dosage: parts[2] || "",
        }
      })

      const added = await api.createMedicamentsBatch(newMedicaments)
      setMedicaments((prev) => [...added, ...prev])
      setBatchInput("")
      setShowBatchForm(false)
      toast({
        title: "Succès",
        description: `${added.length} médicament(s) ajouté(s)`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les médicaments",
        variant: "destructive",
      })
    } finally {
      setIsBatchAdding(false)
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Base de Médicaments
            </CardTitle>
            <CardDescription>Gérez la liste des médicaments disponibles</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un médicament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
              {isSearching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />}
            </div>
            <Button onClick={() => setShowBatchForm(!showBatchForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter en lot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showBatchForm && (
            <Card className="mb-6 border-dashed">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Ajout en lot
                </CardTitle>
                <CardDescription>
                  Entrez un médicament par ligne au format: nom, forme, dosage
                  <br />
                  Exemple: Paracétamol, Comprimé, 500mg
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBatchAdd} className="space-y-4">
                  <div>
                    <Label htmlFor="batch">Médicaments</Label>
                    <Textarea
                      id="batch"
                      rows={6}
                      placeholder="Paracétamol, Comprimé, 500mg&#10;Ibuprofène, Comprimé, 400mg&#10;Amoxicilline, Gélule, 500mg"
                      value={batchInput}
                      onChange={(e) => setBatchInput(e.target.value)}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowBatchForm(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isBatchAdding || !batchInput.trim()}>
                      {isBatchAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Ajouter
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Forme</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicaments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "Aucun médicament trouvé" : "Aucun médicament dans la base"}
                    </TableCell>
                  </TableRow>
                ) : (
                  medicaments.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-medium">{med.nom}</TableCell>
                      <TableCell>{med.forme || <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>{med.dosage || <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {med.description || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
