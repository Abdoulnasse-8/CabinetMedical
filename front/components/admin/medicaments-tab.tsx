
"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { Medicament } from "@/types";
import { Search, Plus, Loader2, Pill, Upload, X, Download } from "lucide-react";

export function MedicamentsTab() {
  const { toast } = useToast();
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isBatchAdding, setIsBatchAdding] = useState(false);
  const [batchInput, setBatchInput] = useState("");
  const [showBatchForm, setShowBatchForm] = useState(false);

  const fetchMedicaments = useCallback(async () => {
    try {
      const data = await api.getMedicaments();
      setMedicaments(data);
    } catch (error) {
      console.error("[MedicamentsTab] Error fetching medicaments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicaments();
  }, [fetchMedicaments]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setMedicaments([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await api.searchMedicaments(query);
      setMedicaments(results);
    } catch (error) {
      console.error("[MedicamentsTab] Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => handleSearch(searchQuery), 300);
      return () => clearTimeout(timer);
    } else {
      fetchMedicaments();
    }
  }, [searchQuery, handleSearch, fetchMedicaments]);

  const handleExport = () => {
    try {
      // Créer le contenu CSV
      const headers = ["Nom", "Forme", "Dosage", "Description"]
      const rows = medicaments.map((med) => [
        med.nom || "",
        med.forme || "",
        med.dosage || "",
        med.description || "",
      ])

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
      ].join("\n")

      // Créer le blob et télécharger
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `medicaments_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Succès",
        description: `${medicaments.length} médicament(s) exporté(s)`,
      })
    } catch (error) {
      console.error("[MedicamentsTab] Export error:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les médicaments",
        variant: "destructive",
      })
    }
  }

  const handleBatchAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchInput.trim()) return;

    setIsBatchAdding(true);
    try {
      const lines = batchInput.split("\n").filter((line) => line.trim());
      const newMedicaments = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        return { nom: parts[0] || "", forme: parts[1] || "", dosage: parts[2] || "" };
      });

      const added = await api.createMedicamentsBatch(newMedicaments);
      setMedicaments((prev) => [...added, ...prev]);
      setBatchInput("");
      setShowBatchForm(false);

      toast({ title: "Succès", description: `${added.length} médicament(s) ajouté(s)` });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les médicaments",
        variant: "destructive",
      });
    } finally {
      setIsBatchAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#70e000]/30 border border-[#70e000]/30">
                <Pill className="h-5 w-5 text-slate-900" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Base de Médicaments</h3>
                <p className="text-sm text-slate-500">Recherchez et gérez la liste des médicaments.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher un médicament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-72 h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-black/10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
              )}
            </div>

            <Button
              onClick={() => setShowBatchForm((v) => !v)}
              className=" rounded-full border border-[#1d3f24]/25 bg-white px-5 py-2 text-sm font-medium text-[#1d3f24] shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter en lot
            </Button>

           <Button
              onClick={handleExport}
              disabled={medicaments.length === 0}
              className="rounded-full border border-[#1d3f24]/25 bg-white px-5 py-2 text-sm font-medium text-[#1d3f24] shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>

          </div>
        </div>

        {/* Batch panel (pas une card) */}
        {showBatchForm && (
          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Upload className="h-4 w-4" />
                  Ajout en lot
                </div>
                <p className="text-sm text-slate-600">
                  Un médicament par ligne : <span className="font-medium">nom, forme, dosage</span> (ex: Paracétamol, Comprimé, 500mg)
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowBatchForm(false)}
                className="h-9 w-9 p-0 rounded-xl hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleBatchAdd} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="batch" className="text-sm text-slate-900">
                  Médicaments
                </Label>
                <Textarea
                  id="batch"
                  rows={6}
                  placeholder={"Paracétamol, Comprimé, 500mg\nIbuprofène, Comprimé, 400mg\nAmoxicilline, Gélule, 500mg"}
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="mt-2 rounded-xl bg-white border-slate-200 font-mono text-sm focus-visible:ring-2 focus-visible:ring-black/10"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBatchForm(false)}
                  className="h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                >
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={isBatchAdding || !batchInput.trim()}
                  className="h-11 rounded-xl px-5 bg-[#70e000] text-black hover:brightness-95 disabled:opacity-60"
                >
                  {isBatchAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="p-6 md:p-8">
        <div className="rounded-[1.25rem] border border-slate-200 overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-slate-600">Nom</TableHead>
                <TableHead className="text-slate-600">Forme</TableHead>
                <TableHead className="text-slate-600">Dosage</TableHead>
                <TableHead className="hidden md:table-cell text-slate-600">Description</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {medicaments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                    {searchQuery ? "Aucun médicament trouvé" : "Aucun médicament dans la base"}
                  </TableCell>
                </TableRow>
              ) : (
                medicaments.map((med) => (
                  <TableRow key={med.id} className="hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-900">{med.nom}</TableCell>
                    <TableCell className="text-slate-700">
                      {med.forme || <span className="text-slate-400">-</span>}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {med.dosage || <span className="text-slate-400">-</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate text-slate-700">
                      {med.description || <span className="text-slate-400">-</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
