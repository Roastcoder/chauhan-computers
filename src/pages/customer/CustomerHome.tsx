import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FileText, ShoppingBag, Clock } from "lucide-react";

export default function CustomerHome() {
  const { profile, user } = useAuth();

  const { data: enquiries = [] } = useQuery({
    queryKey: ["customer-enquiries", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").eq("customer_user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const active = enquiries.filter(e => !["converted", "not_interested"].includes(e.status)).length;
  const converted = enquiries.filter(e => e.status === "converted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {profile?.full_name || "Customer"}</h1>
        <p className="text-sm text-muted-foreground">Here's your activity overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <FileText className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{active}</p>
          <p className="text-xs text-muted-foreground">Active Enquiries</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <ShoppingBag className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-foreground">{converted}</p>
          <p className="text-xs text-muted-foreground">Orders</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <Clock className="w-5 h-5 text-cyan mb-2" />
          <p className="text-2xl font-bold text-foreground">{enquiries.length}</p>
          <p className="text-xs text-muted-foreground">Total Enquiries</p>
        </div>
      </div>
    </div>
  );
}
