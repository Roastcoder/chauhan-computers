import { Outlet } from "react-router-dom";
import { PanelSidebar, PanelMobileHeader } from "@/components/PanelSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { LayoutDashboard, Users, Package, PhoneCall, BarChart3, Settings, ImageIcon, Share2, MessageSquare, Globe, UserCog, Tag, Star, Wrench, FolderOpen, Briefcase } from "lucide-react";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Package, label: "Orders", path: "/admin/orders" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
  { icon: ImageIcon, label: "Banners", path: "/admin/banners" },
  { icon: Star, label: "Testimonials", path: "/admin/testimonials" },
  { icon: Wrench, label: "Services", path: "/admin/services" },
  { icon: Briefcase, label: "Careers", path: "/admin/careers" },
  { icon: Globe, label: "Blogs", path: "/admin/blogs" },
  { icon: Globe, label: "Website", path: "/admin/website" },
  { icon: Share2, label: "Social Media", path: "/admin/social" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
  { icon: UserCog, label: "Users", path: "/admin/users" },
  { icon: PhoneCall, label: "Telecallers", path: "/admin/telecallers" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const adminBottomNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={adminNav} title="Admin Panel" />
      <div className="flex-1 flex flex-col min-w-0">
        <PanelMobileHeader title="Admin Panel" />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav items={adminBottomNav} />
    </div>
  );
}
