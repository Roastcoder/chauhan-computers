import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export default function TelecallerCalls() {
  const { user } = useAuth();

  const { data: calls = [] } = useQuery({
    queryKey: ["tc-calls", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("call_history").select("*, leads(name, phone)").eq("telecaller_id", user!.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Call History</h1>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/[0.05]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Lead</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Outcome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No calls yet</td></tr>}
            {calls.map((call: any) => (
              <tr key={call.id} className="border-b border-foreground/[0.03]">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{call.leads?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{call.leads?.phone}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(call.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    call.outcome === "answered" ? "bg-green-500/20 text-green-400" :
                    call.outcome === "callback" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-surface text-muted-foreground"
                  }`}>{call.outcome.replace("_", " ")}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{call.remarks || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
