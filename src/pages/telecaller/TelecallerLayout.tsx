import { Outlet } from "react-router-dom";
import { PanelSidebar } from "@/components/PanelSidebar";
import { Users, PhoneCall, CalendarClock, TrendingUp } from "lucide-react";

const tcNav = [
  { icon: Users, label: "My Leads", path: "/telecaller" },
  { icon: PhoneCall, label: "Call History", path: "/telecaller/calls" },
  { icon: CalendarClock, label: "Follow-ups", path: "/telecaller/followups" },
  { icon: TrendingUp, label: "My Performance", path: "/telecaller/performance" },
];

export default function TelecallerLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={tcNav} title="Telecaller Panel" />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
