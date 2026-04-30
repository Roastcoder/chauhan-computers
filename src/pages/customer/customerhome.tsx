import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FileText, ShoppingBag, Clock, Star, Gift, ArrowRight, Package, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CustomerHome() {
  const { profile, user } = useAuth();

  const { data: enquiries = [] } = useQuery({
    queryKey: ["customer-enquiries", user?.id],
    queryFn: () => api.get("/enquiries"),
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: () => api.get("/orders"),
    enabled: !!user,
  });

  const { data: loyaltyPoints } = useQuery({
    queryKey: ["customer-loyalty", user?.id],
    queryFn: () => api.get("/loyalty"),
    enabled: !!user,
  });

  const { data: recentTransactions = [] } = useQuery({
    queryKey: ["customer-loyalty-txns", user?.id],
    queryFn: () => api.get("/loyalty/transactions"),
    enabled: !!user,
  });

  const activeEnquiries = (enquiries as any[]).filter(e => !["converted", "not_interested"].includes(e.status)).length;
  const orderCount = (orders as any[]).length;
  const points = (loyaltyPoints as any)?.points || 0;

  return (
    <div className="space-y-8 md:space-y-10 pb-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 rounded-3xl p-8 sm:p-10 text-primary-foreground shadow-2xl shadow-primary/20 border border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full -translate-x-1/3 translate-y-1/3 mix-blend-overlay" />
        
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
              Welcome back, <br className="sm:hidden" /><span className="text-white/90">{profile?.full_name?.split(' ')[0] || "Customer"}</span>
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base font-medium max-w-lg">
              Manage your IT hardware orders, track service requests, and unlock exclusive rewards.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Package, label: "Total Orders", value: orderCount, color: "from-blue-500/20 to-indigo-500/20 text-blue-500", border: "border-blue-500/20" },
          { icon: FileText, label: "Active Enquiries", value: activeEnquiries, color: "from-amber-500/20 to-orange-500/20 text-amber-500", border: "border-amber-500/20" },
          { icon: ShieldCheck, label: "Total Enquiries", value: (enquiries as any[]).length, color: "from-emerald-500/20 to-teal-500/20 text-emerald-500", border: "border-emerald-500/20" },
          { icon: Star, label: "Reward Points", value: points, color: "from-purple-500/20 to-pink-500/20 text-purple-500", border: "border-purple-500/20" },
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
            className={`relative overflow-hidden bg-card/40 backdrop-blur-xl border ${kpi.border} rounded-2xl p-5 md:p-6 group hover:bg-card/60 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${kpi.color} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
            <kpi.icon className={`w-6 h-6 md:w-8 md:h-8 mb-4 relative z-10 ${kpi.color.split(' ')[2]}`} />
            <p className="text-2xl md:text-4xl font-black text-foreground relative z-10 tracking-tight">{kpi.value}</p>
            <p className="text-xs md:text-sm font-medium text-muted-foreground relative z-10 mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Loyalty Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">Loyalty Rewards</h3>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  Earn points on every purchase. Redeem them for exclusive discounts on your next upgrade.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end bg-background/50 p-4 rounded-2xl border border-border/50 w-full md:w-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Available Points</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{points}</span>
                  <span className="text-sm font-medium text-muted-foreground">pts</span>
                </div>
              </div>
            </div>

            {(recentTransactions as any[]).length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/50">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {(recentTransactions as any[]).slice(0, 3).map((txn: any) => (
                    <div key={txn.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.type === "earn" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{txn.description || (txn.type === "earn" ? "Points earned from purchase" : "Points redeemed")}</p>
                          <p className="text-[10px] md:text-xs font-medium text-muted-foreground">{new Date(txn.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${txn.type === "earn" ? "text-green-500" : "text-destructive"}`}>
                        {txn.type === "earn" ? "+" : "-"}{txn.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">Quick Actions</h3>
          
          <Link to="/customer/products" className="group block relative overflow-hidden bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-5 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-foreground mb-0.5">Shop Hardware</h4>
                <p className="text-xs text-muted-foreground">Browse our premium collection</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/customer/quote" className="group block relative overflow-hidden bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-5 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-foreground mb-0.5">Request Quote</h4>
                <p className="text-xs text-muted-foreground">Get custom enterprise pricing</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
          
          <Link to="/customer/profile" className="group block relative overflow-hidden bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-5 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-foreground mb-0.5">My Profile</h4>
                <p className="text-xs text-muted-foreground">Update your details</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
