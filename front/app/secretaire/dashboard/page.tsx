"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientsTab } from "@/components/secretaire/patients-tab"
import { RendezVousTab } from "@/components/secretaire/rendez-vous-tab"
import { FacturesTab } from "@/components/secretaire/factures-tab"
import { Users, Calendar, FileText } from "lucide-react"

const secretaireNavItems = [
  { title: "Tableau de bord", href: "/secretaire/dashboard", icon: navIcons.dashboard },
  { title: "Patients", href: "/secretaire/patients", icon: navIcons.users },
  { title: "Rendez-vous", href: "/secretaire/rendez-vous", icon: navIcons.calendar },
  { title: "Factures", href: "/secretaire/factures", icon: navIcons.fileText },
]

function SecretaireDashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-muted-foreground">Gestion des patients, rendez-vous et factures</p>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-secondary/50 rounded-xl">
          <TabsTrigger
            value="patients"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Patients</span>
          </TabsTrigger>
          <TabsTrigger
            value="rendez-vous"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Rendez-vous</span>
          </TabsTrigger>
          <TabsTrigger
            value="factures"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Factures</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="patients" className="animate-in fade-in-50 duration-300">
          <PatientsTab />
        </TabsContent>
        <TabsContent value="rendez-vous" className="animate-in fade-in-50 duration-300">
          <RendezVousTab />
        </TabsContent>
        <TabsContent value="factures" className="animate-in fade-in-50 duration-300">
          <FacturesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SecretaireDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["SECRETAIRE"]}>
      <DashboardLayout navItems={secretaireNavItems}>
        <SecretaireDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
