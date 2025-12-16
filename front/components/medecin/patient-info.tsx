import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/types"
import { User, Phone, MapPin, Calendar, CreditCard } from "lucide-react"

interface PatientInfoProps {
  patient: Patient
}

export function PatientInfo({ patient }: PatientInfoProps) {
  const calculateAge = (dateNaissance: string) => {
    const today = new Date()
    const birthDate = new Date(dateNaissance)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">
                {patient.prenom} {patient.nom}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline">{patient.sexe === "M" ? "Homme" : "Femme"}</Badge>
                <span className="text-sm text-muted-foreground">{calculateAge(patient.dateNaissance)} ans</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CIN</p>
              <p className="font-medium">{patient.cin}</p>
              {patient.typeMutuelle && (
                <p className="text-sm text-muted-foreground">Mutuelle: {patient.typeMutuelle}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">{patient.telephone}</p>
              {patient.email && <p className="text-sm text-muted-foreground">{patient.email}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">
                {new Date(patient.dateNaissance).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {patient.adresse && (
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{patient.adresse}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
