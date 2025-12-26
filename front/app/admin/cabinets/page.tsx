
"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout, navIcons } from "@/components/layout/dashboard-layout";
import { CabinetsTab } from "@/components/admin/cabinets-tab";

const adminNavItems = [
  { title: "Tableau de bord", href: "/admin/dashboard", icon: navIcons.dashboard },
  { title: "Cabinets", href: "/admin/cabinets", icon: navIcons.building },
  { title: "Médicaments", href: "/admin/medicaments", icon: navIcons.pill },
];

export default function AdminCabinetsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMINISTRATEUR"]}>
      <DashboardLayout navItems={adminNavItems}>
        {/* Background global proche de la home */}
        <div className="min-h-screen bg-gradient-to-b from-[#f5f7f6] to-[#eef3f1]">
          <div className="mx-auto max-w-full px-6 py-5 space-y-8">
            {/* Header section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Administration
                </p>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d3f24]">
                  Gestion des Cabinets
                </h1>

                <p className="max-w-2xl text-sm md:text-base text-[#1d3f24]/70 leading-relaxed">
                  Créez, mettez à jour et organisez les cabinets médicaux. Gardez une vue claire
                  sur les informations, les accès et la structure.
                </p>
              </div>

              {/* Actions (optionnel) */}
            </div>

            {/* Main content card */}
                <CabinetsTab />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
