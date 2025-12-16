"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import type { Consultation, Patient, User } from "@/types"
import { Printer } from "lucide-react"

interface OrdonnancePrintProps {
  consultation: Consultation
  patient: Patient
  medecin: User | null
}

export function OrdonnancePrint({ consultation, patient, medecin }: OrdonnancePrintProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ordonnance - ${patient.prenom} ${patient.nom}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #1f2937;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .doctor-info {
              text-align: left;
              margin-bottom: 20px;
            }
            .doctor-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .specialty {
              color: #6b7280;
              font-style: italic;
            }
            .patient-info {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-weight: bold;
              color: #2563eb;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .content {
              white-space: pre-wrap;
              line-height: 1.6;
            }
            .signature {
              margin-top: 50px;
              text-align: right;
            }
            .date {
              color: #6b7280;
              margin-bottom: 30px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div>
      <div ref={printRef} className="bg-white p-8">
        <div className="header border-b-2 border-primary pb-5 mb-8">
          <div className="doctor-info">
            <div className="text-2xl font-bold text-primary">
              Dr. {medecin?.prenom} {medecin?.nom}
            </div>
            {medecin?.specialite && <div className="text-muted-foreground italic">{medecin.specialite}</div>}
          </div>
        </div>

        <div className="text-muted-foreground mb-6">
          Date:{" "}
          {new Date(consultation.dateConsultation).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="bg-muted rounded-lg p-4 mb-8">
          <p className="font-medium">
            Patient: {patient.prenom} {patient.nom}
          </p>
          <p className="text-sm text-muted-foreground">
            Né(e) le:{" "}
            {new Date(patient.dateNaissance).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {consultation.diagnostic && (
          <div className="mb-6">
            <div className="font-bold text-primary border-b pb-1 mb-2">Diagnostic</div>
            <div className="whitespace-pre-wrap leading-relaxed">{consultation.diagnostic}</div>
          </div>
        )}

        {consultation.traitement && (
          <div className="mb-6">
            <div className="font-bold text-primary border-b pb-1 mb-2">Traitement</div>
            <div className="whitespace-pre-wrap leading-relaxed">{consultation.traitement}</div>
          </div>
        )}

        {consultation.examenSupplementaire && (
          <div className="mb-6">
            <div className="font-bold text-primary border-b pb-1 mb-2">Examens Complémentaires</div>
            <div className="whitespace-pre-wrap leading-relaxed">{consultation.examenSupplementaire}</div>
          </div>
        )}

        {consultation.observations && (
          <div className="mb-6">
            <div className="font-bold text-primary border-b pb-1 mb-2">Observations</div>
            <div className="whitespace-pre-wrap leading-relaxed">{consultation.observations}</div>
          </div>
        )}

        <div className="mt-12 text-right">
          <p className="font-medium">Signature</p>
          <p className="mt-2 text-primary font-semibold">
            Dr. {medecin?.prenom} {medecin?.nom}
          </p>
          {medecin?.signature && <div className="mt-2 text-muted-foreground italic text-sm">{medecin.signature}</div>}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer l{"'"}ordonnance
        </Button>
      </div>
    </div>
  )
}
