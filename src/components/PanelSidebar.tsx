import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, LogOut, LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface Props {
  items: NavItem[];
  title: string;
}

export function PanelSidebar({ items, title }: Props) {
  const { signOut, profile } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 h-screen sticky top-0 glass border-r border-foreground/[0.05] flex flex-col">
      <div className="p-6 border-b border-foreground/[0.05]">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Chauhaan Computers</span>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{title}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-foreground/[0.05]">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full rounded-lg hover:bg-surface"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
