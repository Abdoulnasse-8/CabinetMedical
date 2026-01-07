"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Facture, Cabinet } from "@/types"
import { Printer } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface FacturePrintProps {
  facture: Facture
  cabinetId: number
}

export function FacturePrint({ facture, cabinetId }: FacturePrintProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [cabinet, setCabinet] = useState<Cabinet | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    // Charger les informations du cabinet
    const loadCabinet = async () => {
      try {
        let cab;
        if (user?.role === "ADMINISTRATEUR") {
          const cabinets = await api.getCabinets()
          cab = cabinets.find((c: Cabinet) => c.id === cabinetId)
        } else {
          // Pour médecins et secrétaires, utiliser l'endpoint users/me/cabinet
          cab = await api.getMyCabinet()
          // Vérifier que c'est bien le bon cabinet
          if (cab && cab.id !== cabinetId) {
            console.warn("Cabinet ID mismatch")
          }
        }
        if (cab) setCabinet(cab)
      } catch (error) {
        console.error("Error loading cabinet:", error)
      }
    }
    loadCabinet()
  }, [cabinetId, user?.role])

  const handlePrint = () => {
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
            body {
              font-family: 'Arial', sans-serif;
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
              color: #1f2937;
              background: white;
            }
            .header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .header-left {
              flex: 1;
            }
            .header-title {
              font-size: 32px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .invoice-number {
              font-size: 18px;
              color: #6b7280;
              font-weight: normal;
            }
            .header-right {
              text-align: right;
            }
            .cabinet-logo {
              max-width: 120px;
              max-height: 120px;
              margin-bottom: 10px;
            }
            .cabinet-info {
              font-size: 14px;
              line-height: 1.6;
              color: #374151;
            }
            .cabinet-name {
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 40px;
            }
            .info-box {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .info-title {
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
              font-size: 14px;
              text-transform: uppercase;
            }
            .info-content {
              font-size: 14px;
              line-height: 1.8;
              color: #374151;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .details-table th {
              background: #2563eb;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            .details-table td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .details-table tr:last-child td {
              border-bottom: none;
            }
            .total-section {
              margin-top: 30px;
              display: flex;
              justify-content: flex-end;
            }
            .total-box {
              width: 300px;
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .total-final {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid #2563eb;
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-payee {
              background: #d1fae5;
              color: #065f46;
            }
            .status-attente {
              background: #fef3c7;
              color: #92400e;
            }
            .status-annulee {
              background: #fee2e2;
              color: #991b1b;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
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

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      PAYEE: "Payée",
      EN_ATTENTE: "En attente",
      ANNULEE: "Annulée",
      NON_PAYEE: "Non payée",
    }
    return labels[statut] || statut
  }

  const getStatutClass = (statut: string) => {
    const classes: Record<string, string> = {
      PAYEE: "status-payee",
      EN_ATTENTE: "status-attente",
      ANNULEE: "status-annulee",
      NON_PAYEE: "status-attente",
    }
    return classes[statut] || "status-attente"
  }

  const getModePaiementLabel = (mode?: string) => {
    const labels: Record<string, string> = {
      ESPECES: "Espèces",
      CARTE: "Carte bancaire",
      CHEQUE: "Chèque",
      VIREMENT: "Virement bancaire",
      ASSURANCE: "Assurance",
    }
    return mode ? labels[mode] || mode : "Non spécifié"
  }

  return (
    <div>
      <div ref={printRef} className="bg-white p-8">
        {/* Header */}
        <div className="header border-b-3 border-primary pb-5 mb-8">
          <div className="header-left">
            <div className="header-title text-primary text-3xl font-bold mb-2">
              FACTURE
            </div>
            <div className="invoice-number text-muted-foreground text-lg">
              N° {facture.id}
            </div>
          </div>
          <div className="header-right">
            {cabinet?.logo && (
              <img
                src={cabinet.logo}
                alt="Logo du cabinet"
                className="cabinet-logo max-w-[120px] max-h-[120px] mb-2"
              />
            )}
            <div className="cabinet-info text-right text-sm">
              {cabinet && (
                <>
                  <div className="cabinet-name text-primary text-xl font-bold mb-1">
                    {cabinet.nom}
                  </div>
                  {cabinet.specialite && (
                    <div className="text-muted-foreground italic mb-2">
                      {cabinet.specialite}
                    </div>
                  )}
                  {cabinet.adresse && <div>{cabinet.adresse}</div>}
                  {cabinet.telephone && <div>Tél: {cabinet.telephone}</div>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Informations Patient et Facture */}
        <div className="info-section grid grid-cols-2 gap-8 mb-10">
          <div className="info-box bg-muted rounded-lg p-5 border-l-4 border-primary">
            <div className="info-title text-primary font-bold mb-3 uppercase text-xs">
              Facturé à
            </div>
            <div className="info-content text-sm leading-relaxed">
              {facture.patient ? (
                <>
                  <div className="font-semibold mb-2">
                    {facture.patient.prenom} {facture.patient.nom}
                  </div>
                  {facture.patient.dateNaissance && (
                    <div>
                      Né(e) le:{" "}
                      {new Date(facture.patient.dateNaissance).toLocaleDateString("fr-FR")}
                    </div>
                  )}
                  {facture.patient.telephone && (
                    <div>Tél: {facture.patient.telephone}</div>
                  )}
                  {facture.patient.cin && <div>CIN: {facture.patient.cin}</div>}
                </>
              ) : (
                <div className="text-muted-foreground">Patient non spécifié</div>
              )}
            </div>
          </div>

          <div className="info-box bg-muted rounded-lg p-5 border-l-4 border-primary">
            <div className="info-title text-primary font-bold mb-3 uppercase text-xs">
              Informations de facturation
            </div>
            <div className="info-content text-sm leading-relaxed space-y-1">
              <div>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(facture.dateFacture).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div>
                <span className="font-semibold">Mode de paiement:</span>{" "}
                {getModePaiementLabel(facture.modePaiement)}
              </div>
              <div>
                <span className="font-semibold">Statut:</span>{" "}
                <span className={`status-badge ${getStatutClass(facture.statut)}`}>
                  {getStatutLabel(facture.statut)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails de la facture */}
        <table className="details-table w-full border-collapse mb-8">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-3 text-left font-bold">Description</th>
              <th className="p-3 text-right font-bold">Montant</th>
            </tr>
          </thead>
          <tbody>
            {facture.consultationId && (
              <tr>
                <td className="p-3 border-b">
                  Consultation médicale
                  {facture.notes && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {facture.notes}
                    </div>
                  )}
                </td>
                <td className="p-3 text-right border-b">
                  {facture.montant.toFixed(2)} DH
                </td>
              </tr>
            )}
            {!facture.consultationId && (
              <tr>
                <td className="p-3 border-b">
                  {facture.notes || "Services médicaux"}
                </td>
                <td className="p-3 text-right border-b">
                  {facture.montant.toFixed(2)} DH
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="total-section flex justify-end mt-8">
          <div className="total-box bg-muted rounded-lg p-5 w-[300px]">
            <div className="total-final text-primary text-2xl font-bold border-t-2 border-primary pt-4">
              <span>Total TTC:</span>
              <span>{facture.montant.toFixed(2)} DH</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer mt-12 pt-5 border-t text-center text-xs text-muted-foreground">
          <p>Merci de votre confiance</p>
          <p className="mt-2">
            Facture générée le {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end no-print">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer la facture
        </Button>
      </div>
    </div>
  )
}


