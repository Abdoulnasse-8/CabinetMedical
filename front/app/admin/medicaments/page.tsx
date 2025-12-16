"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { MedicamentsTab } from "@/components/admin/medicaments-tab"

const adminNavItems = [
  { title: "Tableau de bord", href: "/admin/dashboard", icon: navIcons.dashboard },
  { title: "Cabinets", href: "/admin/cabinets", icon: navIcons.building },
  { title: "Médicaments", href: "/admin/medicaments", icon: navIcons.pill },
]

export default function AdminMedicamentsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMINISTRATEUR"]}>
      <DashboardLayout navItems={adminNavItems}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Base de Médicaments</h1>
            <p className="text-muted-foreground">Gérez la liste des médicaments pour les prescriptions</p>
          </div>
          <MedicamentsTab />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
