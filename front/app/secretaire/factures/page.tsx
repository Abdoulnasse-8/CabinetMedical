"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { FacturesTab } from "@/components/secretaire/factures-tab"

const secretaireNavItems = [
  { title: "Tableau de bord", href: "/secretaire/dashboard", icon: navIcons.dashboard },
  { title: "Patients", href: "/secretaire/patients", icon: navIcons.users },
  { title: "Rendez-vous", href: "/secretaire/rendez-vous", icon: navIcons.calendar },
  { title: "Factures", href: "/secretaire/factures", icon: navIcons.fileText },
]

export default function SecretaireFacturesPage() {
  return (
    <ProtectedRoute allowedRoles={["SECRETAIRE"]}>
      <DashboardLayout navItems={secretaireNavItems}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Factures</h1>
            <p className="text-muted-foreground">Créez et suivez les factures des consultations</p>
          </div>
          <FacturesTab />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
