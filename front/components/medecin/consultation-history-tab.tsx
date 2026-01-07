"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Consultation, Patient, User } from "@/types"
import { Calendar, Printer, FileText } from "lucide-react"
import { OrdonnanceMedicaments } from "@/components/medecin/ordonnance-medicaments"
import { OrdonnanceExamens } from "@/components/medecin/ordonnance-examens"

interface ConsultationHistoryTabProps {
  consultations: Consultation[]
  patient: Patient
  medecin: User | null
}

export function ConsultationHistoryTab({ consultations, patient, medecin }: ConsultationHistoryTabProps) {

  if (consultations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune consultation enregistrée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <Card key={consultation.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {new Date(consultation.dateConsultation).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardTitle>
                  <Badge variant={consultation.type === "CONSULTATION" ? "default" : "secondary"}>
                    {consultation.type === "CONSULTATION" ? "Consultation" : "Contrôle"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {consultation.traitement && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Ordonnance Médicaments
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Ordonnance Médicaments</DialogTitle>
                      </DialogHeader>
                      <OrdonnanceMedicaments
                        consultation={consultation}
                        patient={patient}
                        medecin={medecin}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                {consultation.examenSupplementaire && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Ordonnance Examens
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Ordonnance Examens Complémentaires</DialogTitle>
                      </DialogHeader>
                      <OrdonnanceExamens
                        consultation={consultation}
                        patient={patient}
                        medecin={medecin}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {consultation.examenClinique && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Examen Clinique</p>
                  <p className="text-sm">{consultation.examenClinique}</p>
                </div>
              )}
              {consultation.diagnostic && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Diagnostic</p>
                  <p className="text-sm">{consultation.diagnostic}</p>
                </div>
              )}
              {consultation.traitement && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Traitement</p>
                  <p className="text-sm whitespace-pre-wrap">{consultation.traitement}</p>
                </div>
              )}
              {consultation.observations && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Observations</p>
                  <p className="text-sm">{consultation.observations}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
