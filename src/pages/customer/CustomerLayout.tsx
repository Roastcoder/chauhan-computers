import { Outlet } from "react-router-dom";
import { PanelSidebar } from "@/components/PanelSidebar";
import { Home, Package, FileText, Calculator, UserCircle } from "lucide-react";

const customerNav = [
  { icon: Home, label: "Home", path: "/customer" },
  { icon: Package, label: "Products", path: "/customer/products" },
  { icon: FileText, label: "My Enquiries", path: "/customer/enquiries" },
  { icon: Calculator, label: "Get Quote", path: "/customer/quote" },
  { icon: UserCircle, label: "My Profile", path: "/customer/profile" },
];

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={customerNav} title="Customer Panel" />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
