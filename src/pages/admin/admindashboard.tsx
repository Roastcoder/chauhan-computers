import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, PhoneCall, TrendingUp, DollarSign, UserPlus, Package, AlertTriangle, MessageSquare, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["#2563EB", "#06B6D4", "#8B5CF6", "#22C55E", "#EF4444"];

export default function AdminDashboard() {
  const { data: leads = [] } = useQuery({ queryKey: ["admin-leads"], queryFn: () => api.get("/leads") });
  const { data: calls = [] } = useQuery({ queryKey: ["admin-calls"], queryFn: () => api.get("/calls") });
  const { data: products = [] } = useQuery({ queryKey: ["crm-products"], queryFn: () => api.get("/products/all") });
  const { data: messages = [] } = useQuery({ queryKey: ["contact-messages"], queryFn: () => api.get("/contact-messages"), retry: false });
  const { data: settings = [] } = useQuery({ queryKey: ["crm-settings"], queryFn: () => api.get("/settings") });

  const lowStockThreshold = (settings as any[]).find((s: any) => s.key === "inventory_config")?.value?.low_stock_threshold ?? 5;

  const todayLeads = (leads as any[]).filter((l: any) => new Date(l.created_at).toDateString() === new Date().toDateString());
  const assigned = (leads as any[]).filter((l: any) => l.assigned_to);
  const converted = (leads as any[]).filter((l: any) => l.status === "converted");
  const lowStock = (products as any[]).filter((p: any) => p.stock_quantity <= lowStockThreshold && p.stock_quantity > 0 && p.is_active);
  const outOfStock = (products as any[]).filter((p: any) => p.stock_quantity === 0 && p.is_active);
  const unreadMessages = (messages as any[]).filter((m: any) => !m.is_read);

  const kpis = [
    { icon: UserPlus, label: "Leads Today", value: todayLeads.length, color: "text-primary", to: "/admin/leads" },
    { icon: Users, label: "Leads Assigned", value: assigned.length, color: "text-cyan-500", to: "/admin/leads" },
    { icon: PhoneCall, label: "Calls Made", value: (calls as any[]).length, color: "text-purple-500", to: "/admin/telecallers" },
    { icon: TrendingUp, label: "Conversions", value: converted.length, color: "text-green-500", to: "/admin/reports" },
    { icon: DollarSign, label: "Revenue Est.", value: `₹${(converted.length * 50000).toLocaleString()}`, color: "text-yellow-500", to: "/admin/reports" },
    { icon: Package, label: "Total Products", value: (products as any[]).length, color: "text-indigo-500", to: "/admin/products" },
  ];

  const sourceData = ["meta", "google", "manual", "website", "whatsapp"].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: (leads as any[]).filter((l: any) => l.source === s).length,
  }));

  const statusData = ["new", "contacted", "interested", "converted", "not_interested"].map((s, i) => ({
    name: s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
    value: (leads as any[]).filter((l: any) => l.status === s).length,
    color: COLORS[i],
  }));

  const recentLeads = (leads as any[]).slice(0, 8);

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0 || unreadMessages.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {outOfStock.length > 0 && (
            <Link to="/admin/products" className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium border border-red-500/20 hover:bg-red-500/20">
              <AlertTriangle className="w-3.5 h-3.5" /> {outOfStock.length} products out of stock
            </Link>
          )}
          {lowStock.length > 0 && (
            <Link to="/admin/products" className="flex items-center gap-1.5 px-3 py-2 bg-yellow-500/10 text-yellow-600 rounded-xl text-xs font-medium border border-yellow-500/20 hover:bg-yellow-500/20">
              <AlertTriangle className="w-3.5 h-3.5" /> {lowStock.length} products low on stock
            </Link>
          )}
          {unreadMessages.length > 0 && (
            <Link to="/admin/messages" className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl text-xs font-medium border border-primary/20 hover:bg-primary/20">
              <MessageSquare className="w-3.5 h-3.5" /> {unreadMessages.length} unread messages
            </Link>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={kpi.to} className="block bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
              <kpi.icon className={`w-4 h-4 ${kpi.color} mb-1.5`} />
              <p className="text-lg md:text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{kpi.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Add Product", to: "/admin/products" },
            { label: "Add Banner", to: "/admin/banners" },
            { label: "View Messages", to: "/admin/messages" },
            { label: "Manage Banners", to: "/admin/banners" },
            { label: "Edit Store Info", to: "/admin/website" },
            { label: "View Reports", to: "/admin/reports" },
          ].map(a => (
            <Link key={a.label} to={a.to} className="flex items-center gap-1 px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground hover:bg-muted hover:border-primary/30 transition-colors">
              {a.label} <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-semibold text-foreground mb-3 md:mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 12 }} />
              <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-semibold text-foreground mb-3 md:mb-4">Lead Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => value > 0 ? name : ""} labelLine={false}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-xs md:text-sm font-semibold text-foreground">Recent Leads</h3>
          <Link to="/admin/leads" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="hidden md:block">
          {recentLeads.length === 0 && <p className="text-xs text-muted-foreground">No leads yet.</p>}
          {recentLeads.map((lead: any) => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.source} · {new Date(lead.created_at).toLocaleString()}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${lead.status === "new" ? "bg-primary/20 text-primary" : lead.status === "converted" ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>{lead.status}</span>
            </div>
          ))}
        </div>
        <div className="md:hidden space-y-2">
          {recentLeads.length === 0 && <p className="text-xs text-muted-foreground">No leads yet.</p>}
          {recentLeads.map((lead: any) => (
            <div key={lead.id} className="bg-background rounded-xl p-3">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lead.status === "new" ? "bg-primary/20 text-primary" : lead.status === "converted" ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>{lead.status}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{lead.source} · {new Date(lead.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
