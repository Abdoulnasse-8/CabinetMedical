"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Consultation, Patient, User } from "@/types"
import { Printer, Microscope } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"

interface OrdonnanceExamensProps {
  consultation: Consultation
  patient: Patient
  medecin: User | null
}

export function OrdonnanceExamens({ consultation, patient, medecin }: OrdonnanceExamensProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const [cabinet, setCabinet] = useState<{ nom?: string; logo?: string } | null>(null)

  useEffect(() => {
    const loadCabinet = async () => {
      if (!user?.cabinetId) return
      try {
        let cab;
        if (user.role === "ADMINISTRATEUR") {
          const cabinets = await api.getCabinets()
          cab = cabinets.find((c: any) => c.id === user.cabinetId)
        } else {
          cab = await api.getMyCabinet()
        }
        if (cab) setCabinet({ nom: cab.nom, logo: cab.logo })
      } catch (error) {
        console.error("Error loading cabinet:", error)
      }
    }
    loadCabinet()
  }, [user?.cabinetId, user?.role])

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ordonnance Examens - ${patient.prenom} ${patient.nom}</title>
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
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header-title {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .doctor-info {
              text-align: left;
              margin-bottom: 20px;
            }
            .doctor-name {
              font-size: 22px;
              font-weight: bold;
              color: #2563eb;
            }
            .specialty {
              color: #6b7280;
              font-style: italic;
              margin-top: 5px;
            }
            .patient-info {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #2563eb;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 20px;
              margin-top: 30px;
            }
            .examens-content {
              white-space: pre-wrap;
              line-height: 2;
              font-size: 16px;
              padding: 15px;
              background: #fafafa;
              border-radius: 5px;
            }
            .signature-section {
              margin-top: 60px;
              text-align: right;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .signature-name {
              font-size: 18px;
              font-weight: bold;
              color: #2563eb;
              margin-top: 10px;
            }
            .date {
              color: #6b7280;
              margin-bottom: 30px;
              font-size: 14px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  if (!consultation.examenSupplementaire) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Microscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Aucun examen complémentaire prescrit pour cette consultation</p>
      </div>
    )
  }

  return (
    <div>
      <div ref={printRef} className="bg-white p-8">
        <div className="header border-b-3 border-primary pb-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="header-title">ORDONNANCE D&apos;EXAMENS COMPLÉMENTAIRES</div>
            </div>
            {cabinet?.logo && (
              <div className="ml-4">
                <img
                  src={cabinet.logo}
                  alt="Logo du cabinet"
                  className="h-20 w-20 object-contain"
                />
              </div>
            )}
          </div>
          {cabinet?.nom && (
            <div className="text-center text-sm text-muted-foreground mb-3">
              {cabinet.nom}
            </div>
          )}
          <div className="doctor-info">
            <div className="text-xl font-bold text-primary">
              Dr. {medecin?.prenom} {medecin?.nom}
            </div>
            {medecin?.specialite && (
              <div className="text-muted-foreground italic text-sm mt-1">
                {medecin.specialite}
              </div>
            )}
          </div>
        </div>

        <div className="date text-muted-foreground mb-6">
          Date:{" "}
          {new Date(consultation.dateConsultation).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="patient-info bg-muted rounded-lg p-4 mb-8">
          <p className="font-semibold text-base">
            Patient: {patient.prenom} {patient.nom}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
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
            <div className="font-semibold text-primary text-base mb-2">Diagnostic</div>
            <div className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              {consultation.diagnostic}
            </div>
          </div>
        )}

        <div className="section-title text-primary border-b-2 pb-2 mb-4">
          EXAMENS COMPLÉMENTAIRES PRESCRITS
        </div>

        <div className="examens-content bg-muted rounded-lg p-4 whitespace-pre-wrap leading-relaxed text-base">
          {consultation.examenSupplementaire}
        </div>

        {consultation.observations && (
          <div className="mt-6">
            <div className="font-semibold text-sm text-muted-foreground mb-2">Instructions particulières</div>
            <div className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              {consultation.observations}
            </div>
          </div>
        )}

        <div className="signature-section mt-12 text-right border-t pt-6">
          <p className="font-medium text-base">Signature</p>
          <div className="signature-name text-primary font-semibold mt-2">
            Dr. {medecin?.prenom} {medecin?.nom}
          </div>
          {medecin?.signature && (
            <div className="mt-3">
              {medecin.signature.startsWith('http') || medecin.signature.startsWith('data:image') ? (
                <img
                  src={medecin.signature}
                  alt="Signature du médecin"
                  className="max-w-[200px] max-h-[80px] object-contain"
                />
              ) : (
                <div className="text-muted-foreground italic text-sm">{medecin.signature}</div>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Signature et cachet du médecin
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end no-print">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer l&apos;ordonnance examens
        </Button>
      </div>
    </div>
  )
}


