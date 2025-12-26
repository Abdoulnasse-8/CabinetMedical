
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout";
import { MedicamentsTab } from "@/components/admin/medicaments-tab";

const adminNavItems = [
  { title: "Tableau de bord", href: "/admin/dashboard", icon: navIcons.dashboard },
  { title: "Cabinets", href: "/admin/cabinets", icon: navIcons.building },
  { title: "Médicaments", href: "/admin/medicaments", icon: navIcons.pill },
];

export default function AdminMedicamentsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMINISTRATEUR"]}>
      <DashboardLayout navItems={adminNavItems}>
        {/* Fond global comme la Home */}
        <div className="min-h-screen bg-gradient-to-b from-[#f5f7f6] to-[#eef3f1]">
          <div className="mx-auto max-w-full px-6 py-10 space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Administration
                </p>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d3f24]">
                  Base de Médicaments
                </h1>

                <p className="max-w-2xl text-sm md:text-base text-[#1d3f24]/70 leading-relaxed">
                  Gérez la liste des médicaments utilisés dans les prescriptions médicales.
                  Ajoutez, modifiez ou désactivez des entrées en toute simplicité.
                </p>
              </div>
            </div>

            <MedicamentsTab />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
