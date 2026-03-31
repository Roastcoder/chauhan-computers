import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, PhoneCall, TrendingUp, DollarSign, UserPlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563EB", "#06B6D4", "#8B5CF6", "#22C55E", "#EF4444"];

export default function AdminDashboard() {
  const { data: leads = [] } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: calls = [] } = useQuery({
    queryKey: ["admin-calls"],
    queryFn: async () => {
      const { data } = await supabase.from("call_history").select("*");
      return data || [];
    },
  });

  const todayLeads = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString());
  const assigned = leads.filter(l => l.assigned_to);
  const converted = leads.filter(l => l.status === "converted");

  const kpis = [
    { icon: UserPlus, label: "Leads Today", value: todayLeads.length, color: "text-primary" },
    { icon: Users, label: "Leads Assigned", value: assigned.length, color: "text-cyan" },
    { icon: PhoneCall, label: "Calls Made", value: calls.length, color: "text-purple-400" },
    { icon: TrendingUp, label: "Conversions", value: converted.length, color: "text-green-400" },
    { icon: DollarSign, label: "Revenue Est.", value: `₹${(converted.length * 50000).toLocaleString()}`, color: "text-yellow-400" },
  ];

  const sourceData = ["meta", "google", "manual", "website", "whatsapp"].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: leads.filter(l => l.source === s).length,
  }));

  const statusData = ["new", "contacted", "interested", "converted", "not_interested"].map((s, i) => ({
    name: s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
    value: leads.filter(l => l.status === s).length,
    color: COLORS[i],
  }));

  const recentLeads = leads.slice(0, 10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sourceData}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215,20%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(225,40%,10%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Lead Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => value > 0 ? name : ""} labelLine={false}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(225,40%,10%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Feed */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Leads</h3>
        <div className="space-y-2">
          {recentLeads.length === 0 && <p className="text-xs text-muted-foreground">No leads yet.</p>}
          {recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.source} · {new Date(lead.created_at).toLocaleString()}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                lead.status === "new" ? "bg-primary/20 text-primary" :
                lead.status === "converted" ? "bg-green-500/20 text-green-400" :
                "bg-background text-muted-foreground"
              }`}>{lead.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
