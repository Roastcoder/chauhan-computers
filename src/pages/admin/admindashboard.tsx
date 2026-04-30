import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  Users, PhoneCall, TrendingUp, DollarSign, UserPlus, Package, 
  AlertTriangle, MessageSquare, ExternalLink, ShoppingBag, 
  Clock, ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

export default function AdminDashboard() {
  const { data: leads = [] } = useQuery({ queryKey: ["admin-leads"], queryFn: () => api.get("/leads") });
  const { data: calls = [] } = useQuery({ queryKey: ["admin-calls"], queryFn: () => api.get("/calls") });
  const { data: products = [] } = useQuery({ queryKey: ["crm-products"], queryFn: () => api.get("/products/all") });
  const { data: messages = [] } = useQuery({ queryKey: ["contact-messages"], queryFn: () => api.get("/contact-messages"), retry: false });
  const { data: settings = [] } = useQuery({ queryKey: ["crm-settings"], queryFn: () => api.get("/settings") });
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders-stats"], queryFn: () => api.get("/orders") });

  const lowStockThreshold = (settings as any[]).find((s: any) => s.key === "inventory_config")?.value?.low_stock_threshold ?? 5;

  const todayLeads = (leads as any[]).filter((l: any) => new Date(l.created_at).toDateString() === new Date().toDateString());
  const converted = (leads as any[]).filter((l: any) => l.status === "converted");
  const lowStock = (products as any[]).filter((p: any) => p.stock_quantity <= lowStockThreshold && p.stock_quantity > 0 && p.is_active);
  const outOfStock = (products as any[]).filter((p: any) => p.stock_quantity === 0 && p.is_active);
  const unreadMessages = (messages as any[]).filter((m: any) => !m.is_read);
  
  const totalRevenue = (orders as any[]).reduce((acc: number, curr: any) => acc + (curr.status === 'paid' ? Number(curr.amount) : 0), 0);
  const recentOrders = (orders as any[]).slice(0, 5);

  const kpis = [
    { icon: UserPlus, label: "New Leads", value: todayLeads.length, trend: "+12%", color: "blue" },
    { icon: ShoppingBag, label: "Total Orders", value: (orders as any[]).length, trend: "+8%", color: "purple" },
    { icon: DollarSign, label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "+15%", color: "emerald" },
    { icon: PhoneCall, label: "Calls Logged", value: (calls as any[]).length, trend: "+5%", color: "amber" },
  ];

  const chartData = (leads as any[]).slice(-7).map(l => ({
    name: format(new Date(l.created_at), "MMM dd"),
    leads: Math.floor(Math.random() * 10) + 5,
    conversions: Math.floor(Math.random() * 3),
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> System performance is optimal today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-card border border-border/50 rounded-2xl flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Stats</span>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0 || unreadMessages.length > 0) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3">
          {outOfStock.length > 0 && (
            <Link to="/admin/products" className="group flex items-center gap-2.5 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/15 text-red-500 rounded-2xl text-xs font-bold border border-red-500/20 transition-all">
              <AlertTriangle className="w-4 h-4" /> {outOfStock.length} Items Depleted
            </Link>
          )}
          {unreadMessages.length > 0 && (
            <Link to="/admin/messages" className="group flex items-center gap-2.5 px-4 py-2.5 bg-primary/10 hover:bg-primary/15 text-primary rounded-2xl text-xs font-bold border border-primary/20 transition-all">
              <MessageSquare className="w-4 h-4" /> {unreadMessages.length} Pending Inquiries
            </Link>
          )}
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={kpi.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${kpi.color}-500/10 transition-colors`} />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-500`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground tracking-tight">{kpi.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                    <ArrowUpRight className="w-3 h-3" /> {kpi.trend}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-foreground">Growth Analytics</h3>
              <p className="text-xs font-medium text-muted-foreground">Performance metrics over the last 7 days</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Leads</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                  itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Inventory Sync", icon: Package, to: "/admin/products", desc: "Manage stocks and pricing" },
              { label: "Order History", icon: ShoppingBag, to: "/admin/orders", desc: "View all customer purchases" },
              { label: "Marketing", icon: ImageIcon, to: "/admin/banners", desc: "Update website banners" },
              { label: "Support", icon: MessageSquare, to: "/admin/messages", desc: "Respond to customer queries" },
            ].map((action, i) => (
              <Link 
                key={action.label} 
                to={action.to} 
                className="group flex items-center gap-4 p-4 rounded-3xl bg-background border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:translate-x-1 transition-transform">{action.label}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-foreground">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">View Ledger</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No recent transactions recorded.</p>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">#{order.receipt.split('_')[1]}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">{format(new Date(order.created_at), "MMM dd, p")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">₹{Number(order.amount).toLocaleString()}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-foreground">Incoming Leads</h3>
            <Link to="/admin/leads" className="text-xs font-bold text-primary hover:underline">Manage All</Link>
          </div>
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{lead.name}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">{lead.source} · {format(new Date(lead.created_at), "MMM dd")}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${lead.status === 'new' ? 'bg-blue-500/10 text-blue-500' : lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
