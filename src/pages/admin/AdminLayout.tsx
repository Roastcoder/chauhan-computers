import { Outlet } from "react-router-dom";
import { PanelSidebar } from "@/components/PanelSidebar";
import { LayoutDashboard, Users, Package, PhoneCall, BarChart3, Settings } from "lucide-react";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: PhoneCall, label: "Telecallers", path: "/admin/telecallers" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={adminNav} title="Admin Panel" />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
