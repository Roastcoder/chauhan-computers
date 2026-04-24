import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PhoneCall, TrendingUp, CalendarClock, Users } from "lucide-react";

export default function TelecallerPerformance() {
  const { user } = useAuth();

  const { data: calls = [] } = useQuery({
    queryKey: ["tc-perf-calls", user?.id],
    queryFn: () => api.get("/calls"),
    enabled: !!user,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["tc-perf-leads", user?.id],
    queryFn: () => api.get("/leads"),
    enabled: !!user,
  });

  const today = new Date().toDateString();
  const callsToday = (calls as any[]).filter(c => new Date(c.created_at).toDateString() === today).length;
  const converted = (leads as any[]).filter(l => l.status === "converted").length;
  const pendingFollowups = (leads as any[]).filter(l => l.follow_up_at && new Date(l.follow_up_at) >= new Date()).length;

  const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCalls = (calls as any[]).filter(c => new Date(c.created_at) >= thirtyDaysAgo);
  const uniqueDays = new Set(recentCalls.map(c => new Date(c.created_at).toDateString())).size;
  const avgCalls = uniqueDays > 0 ? (recentCalls.length / uniqueDays).toFixed(1) : "0";

  const kpis = [
    { icon: PhoneCall, label: "Calls Today", value: callsToday, color: "text-primary" },
    { icon: TrendingUp, label: "Leads Converted", value: converted, color: "text-green-400" },
    { icon: Users, label: "Avg Calls/Day", value: avgCalls, color: "text-cyan-400" },
    { icon: CalendarClock, label: "Follow-ups Pending", value: pendingFollowups, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Performance</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Lead Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {["new", "contacted", "interested", "converted", "not_interested"].map(status => (
            <div key={status} className="bg-background rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-foreground">{(leads as any[]).filter(l => l.status === status).length}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{status.replace("_", " ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
