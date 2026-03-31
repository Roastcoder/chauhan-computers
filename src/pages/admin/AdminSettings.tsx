import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminSettings() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_settings").select("*");
      return data || [];
    },
  });

  const autoAssign = settings.find(s => s.key === "auto_assign");
  const storeInfo = settings.find(s => s.key === "store_info");
  const isAutoAssign = (autoAssign?.value as any)?.enabled || false;

  const toggleAutoAssign = useMutation({
    mutationFn: async () => {
      await supabase.from("crm_settings").update({ value: { enabled: !isAutoAssign } }).eq("key", "auto_assign");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Settings updated");
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Lead Assignment</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Auto-assign leads (round-robin)</p>
            <p className="text-xs text-muted-foreground">Automatically distribute new leads across telecallers</p>
          </div>
          <button
            onClick={() => toggleAutoAssign.mutate()}
            className={`w-12 h-6 rounded-full transition-colors ${isAutoAssign ? "bg-primary" : "bg-surface"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${isAutoAssign ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Store Information</h3>
        {storeInfo && (
          <div className="space-y-3 text-sm">
            <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{(storeInfo.value as any)?.name}</span></div>
            <div><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{(storeInfo.value as any)?.address}</span></div>
            <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{(storeInfo.value as any)?.phone}</span></div>
            <div><span className="text-muted-foreground">Hours:</span> <span className="text-foreground">{(storeInfo.value as any)?.hours}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
