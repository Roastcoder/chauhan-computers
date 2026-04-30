import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift, MessageCircle, Wrench, Zap, CreditCard } from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-12 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}>
      <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-0.5"}`} />
    </button>
  );
}

function SettingRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function AdminSettings() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const get = (key: string, fallback: any = {}) =>
    (settings as any[]).find((s: any) => s.key === key)?.value ?? fallback;

  const autoAssign = get("auto_assign", { enabled: false });
  const loyaltyData = get("loyalty_config", { points_per_100_rupees: 1, point_value_rupees: 1, enabled: true });
  const siteFlags = get("site_flags", { whatsapp_button: true, emi_banner: true, maintenance_mode: false, newsletter_popup: true });

  const [pointsPer100, setPointsPer100] = useState<string>(String(loyaltyData.points_per_100_rupees || 1));
  const [pointValue, setPointValue] = useState<string>(String(loyaltyData.point_value_rupees || 1));
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(loyaltyData.enabled !== false);

  const save = (key: string, value: any) =>
    api.put(`/settings/${key}`, { value }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Setting saved");
    });

  const toggleFlag = (flag: string) => {
    const updated = { ...siteFlags, [flag]: !siteFlags[flag] };
    save("site_flags", updated);
  };

  const saveLoyalty = useMutation({
    mutationFn: () => save("loyalty_config", { points_per_100_rupees: Number(pointsPer100) || 1, point_value_rupees: Number(pointValue) || 1, enabled: loyaltyEnabled }),
    onSuccess: () => toast.success("Loyalty settings saved"),
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">Settings</h1>

      {/* Site Features */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Site Features</h3>
        </div>
        <SettingRow label="WhatsApp Button" description="Show floating WhatsApp chat button on all pages" checked={siteFlags.whatsapp_button !== false} onChange={() => toggleFlag("whatsapp_button")} />
        <SettingRow label="EMI Banner" description="Show EMI / financing promotional banner on homepage" checked={siteFlags.emi_banner !== false} onChange={() => toggleFlag("emi_banner")} />
        <SettingRow label="Newsletter Popup" description="Show newsletter subscription popup to visitors" checked={siteFlags.newsletter_popup !== false} onChange={() => toggleFlag("newsletter_popup")} />
        <SettingRow label="Maintenance Mode" description="Show maintenance page to all visitors (admin still accessible)" checked={!!siteFlags.maintenance_mode} onChange={() => toggleFlag("maintenance_mode")} />
      </div>

      {/* Inventory Alerts */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Inventory Alerts</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Low Stock Threshold</label>
            <p className="text-xs text-muted-foreground mb-2">Show "Low Stock" warning when quantity is at or below this number</p>
            <input
              type="number"
              min="0"
              value={get("inventory_config", { low_stock_threshold: 5 }).low_stock_threshold}
              onChange={e => save("inventory_config", { low_stock_threshold: Number(e.target.value) || 5 })}
              className="w-full md:w-48 px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Current: Products with ≤ {get("inventory_config", { low_stock_threshold: 5 }).low_stock_threshold} items show yellow alert</p>
          </div>
        </div>
      </div>

      {/* Lead Assignment */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Lead Assignment</h3>
        </div>
        <SettingRow label="Auto-assign leads (round-robin)" description="Automatically distribute new leads across telecallers" checked={!!autoAssign.enabled} onChange={() => save("auto_assign", { enabled: !autoAssign.enabled })} />
      </div>

      {/* WhatsApp Config */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-green-500" />
          <h3 className="text-sm font-semibold text-foreground">WhatsApp Configuration</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Update the WhatsApp number and default message in Website → Store Information.</p>
        <a href="/admin/website" className="text-xs text-primary hover:underline">Go to Website Settings →</a>
      </div>

      {/* Loyalty */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Loyalty Points</h3>
        </div>
        <div className="space-y-4">
          <SettingRow label="Enable Loyalty Program" description="Allow customers to earn and redeem points" checked={loyaltyEnabled} onChange={() => setLoyaltyEnabled(!loyaltyEnabled)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Points earned per ₹100 spent</label>
              <input type="number" min="0" value={pointsPer100} onChange={e => setPointsPer100(e.target.value)} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Point value in ₹ (1 point = ₹?)</label>
              <input type="number" min="0" step="0.5" value={pointValue} onChange={e => setPointValue(e.target.value)} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
            </div>
          </div>
          <button onClick={() => saveLoyalty.mutate()} disabled={saveLoyalty.isPending} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
            {saveLoyalty.isPending ? "Saving..." : "Save Loyalty Settings"}
          </button>
        </div>
      </div>

      {/* Razorpay Config */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Razorpay Configuration</h3>
        </div>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Override system environment variables with custom Razorpay API keys.</p>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Razorpay Key ID</label>
              <input 
                type="text" 
                value={get("razorpay_config", { key_id: "" }).key_id} 
                onChange={e => save("razorpay_config", { ...get("razorpay_config", {}), key_id: e.target.value })} 
                className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none font-mono" 
                placeholder="rzp_live_..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Razorpay Key Secret</label>
              <input 
                type="password" 
                value={get("razorpay_config", { key_secret: "" }).key_secret} 
                onChange={e => save("razorpay_config", { ...get("razorpay_config", {}), key_secret: e.target.value })} 
                className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none font-mono" 
                placeholder="••••••••••••••••"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
            <Zap className="w-3 h-3" />
            Warning: These keys will be used for all live transactions immediately.
          </div>
        </div>
      </div>
    </div>
  );
}
