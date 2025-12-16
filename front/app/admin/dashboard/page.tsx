"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CabinetsTab } from "@/components/admin/cabinets-tab"
import { MedicamentsTab } from "@/components/admin/medicaments-tab"
import { Building2, Pill } from "lucide-react"

const adminNavItems = [
  { title: "Tableau de bord", href: "/admin/dashboard", icon: navIcons.dashboard },
  { title: "Cabinets", href: "/admin/cabinets", icon: navIcons.building },
  { title: "Médicaments", href: "/admin/medicaments", icon: navIcons.pill },
]

function AdminDashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="mt-1 text-muted-foreground">Gestion des cabinets médicaux et base de médicaments</p>
      </div>

      <Tabs defaultValue="cabinets" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-14 p-1 bg-secondary/50 rounded-xl">
          <TabsTrigger
            value="cabinets"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
          >
            <Building2 className="h-4 w-4" />
            Cabinets
          </TabsTrigger>
          <TabsTrigger
            value="medicaments"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
          >
            <Pill className="h-4 w-4" />
            Médicaments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cabinets" className="animate-in fade-in-50 duration-300">
          <CabinetsTab />
        </TabsContent>
        <TabsContent value="medicaments" className="animate-in fade-in-50 duration-300">
          <MedicamentsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMINISTRATEUR"]}>
      <DashboardLayout navItems={adminNavItems}>
        <AdminDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
