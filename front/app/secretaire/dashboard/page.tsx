"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientsTab } from "@/components/secretaire/patients-tab"
import { RendezVousTab } from "@/components/secretaire/rendez-vous-tab"
import { FacturesTab } from "@/components/secretaire/factures-tab"
import { AlertsSection } from "@/components/secretaire/alerts-section"
import { Users, Calendar, FileText } from "lucide-react"

const secretaireNavItems = [
  { title: "Tableau de bord", href: "/secretaire/dashboard", icon: navIcons.dashboard },
  { title: "Patients", href: "/secretaire/patients", icon: navIcons.users },
  { title: "Rendez-vous", href: "/secretaire/rendez-vous", icon: navIcons.calendar },
  { title: "Factures", href: "/secretaire/factures", icon: navIcons.fileText },
]

function SecretaireDashboardContent() {

return (
  <div className="min-h-screen bg-gradient-to-b from-[#f5f7f6] to-[#eef3f1]">
    <div className="mx-auto max-w-full px-6 py-10 space-y-10">

      {/* HEADER */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Secrétariat
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-[#1d3f24]">
          Tableau de bord
        </h1>

        <p className="text-sm md:text-base text-[#1d3f24]/70">
          Gestion des patients, rendez-vous et factures
        </p>
      </div>

      {/* ALERTS SECTION */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#1d3f24]">Alertes et notifications</h2>
        <AlertsSection />
      </div>

      {/* MAIN CARD */}
      <div className="rounded-[2rem] bg-white/70 backdrop-blur border border-slate-200/60 shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
        <div className="p-6 md:p-10 space-y-8">

          {/* TABS */}
          <Tabs defaultValue="patients" className="space-y-6">
            <TabsList className="grid h-14 w-full grid-cols-3 rounded-xl bg-[#2D4B23]/10 p-1">
              <TabsTrigger
                value="patients"
                className="flex items-center justify-center gap-2 rounded-lg text-sm font-medium text-[#1d3f24]/70 transition-all
                  data-[state=active]:bg-white
                  data-[state=active]:text-[#2D4B23]
                  data-[state=active]:shadow-md"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Patients</span>
              </TabsTrigger>

              <TabsTrigger
                value="rendez-vous"
                className="flex items-center justify-center gap-2 rounded-lg text-sm font-medium text-[#1d3f24] transition-all
                  data-[state=active]:bg-white
                  data-[state=active]:text-[#2D4B23]
                  data-[state=active]:shadow-md"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Rendez-vous</span>
              </TabsTrigger>

              <TabsTrigger
                value="factures"
                className="flex items-center justify-center gap-2 rounded-lg text-sm font-medium text-[#1d3f24] transition-all
                  data-[state=active]:bg-white
                  data-[state=active]:text-[#2D4B23]
                  data-[state=active]:shadow-md"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Factures</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENTS */}
            <TabsContent
              value="patients"
              className="animate-in fade-in-50 duration-300"
            >
              <PatientsTab />
            </TabsContent>

            <TabsContent
              value="rendez-vous"
              className="animate-in fade-in-50 duration-300"
            >
              <RendezVousTab />
            </TabsContent>

            <TabsContent
              value="factures"
              className="animate-in fade-in-50 duration-300"
            >
              <FacturesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
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
