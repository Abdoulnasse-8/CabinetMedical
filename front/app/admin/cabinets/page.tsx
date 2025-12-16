"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { CabinetsTab } from "@/components/admin/cabinets-tab"

const adminNavItems = [
  { title: "Tableau de bord", href: "/admin/dashboard", icon: navIcons.dashboard },
  { title: "Cabinets", href: "/admin/cabinets", icon: navIcons.building },
  { title: "Médicaments", href: "/admin/medicaments", icon: navIcons.pill },
]

export default function AdminCabinetsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMINISTRATEUR"]}>
      <DashboardLayout navItems={adminNavItems}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Cabinets</h1>
            <p className="text-muted-foreground">Créez et gérez les cabinets médicaux</p>
          </div>
          <CabinetsTab />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
