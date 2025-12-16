"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { RendezVousTab } from "@/components/secretaire/rendez-vous-tab"

const secretaireNavItems = [
  { title: "Tableau de bord", href: "/secretaire/dashboard", icon: navIcons.dashboard },
  { title: "Patients", href: "/secretaire/patients", icon: navIcons.users },
  { title: "Rendez-vous", href: "/secretaire/rendez-vous", icon: navIcons.calendar },
  { title: "Factures", href: "/secretaire/factures", icon: navIcons.fileText },
]

export default function SecretaireRendezVousPage() {
  return (
    <ProtectedRoute allowedRoles={["SECRETAIRE"]}>
      <DashboardLayout navItems={secretaireNavItems}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Rendez-vous</h1>
            <p className="text-muted-foreground">Planifiez et gérez les rendez-vous des patients</p>
          </div>
          <RendezVousTab />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
