"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { PatientsTab } from "@/components/secretaire/patients-tab"

const secretaireNavItems = [
  { title: "Tableau de bord", href: "/secretaire/dashboard", icon: navIcons.dashboard },
  { title: "Patients", href: "/secretaire/patients", icon: navIcons.users },
  { title: "Rendez-vous", href: "/secretaire/rendez-vous", icon: navIcons.calendar },
  { title: "Factures", href: "/secretaire/factures", icon: navIcons.fileText },
]

export default function SecretairePatientsPage() {
  return (
    <ProtectedRoute allowedRoles={["SECRETAIRE"]}>
      <DashboardLayout navItems={secretaireNavItems}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Patients</h1>
            <p className="text-muted-foreground">Créez, modifiez et gérez les dossiers patients</p>
          </div>
          <PatientsTab />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
