import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Package, Download, Eye, IndianRupee, Clock, ChevronRight, Search, Filter, ShoppingBag, TrendingUp, FileText, CalendarDays, Receipt, X, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-cc.png";

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  paid: { bg: "bg-emerald-500/10", text: "text-emerald-600", icon: CheckCircle2 },
  delivered: { bg: "bg-emerald-500/10", text: "text-emerald-600", icon: CheckCircle2 },
  cancelled: { bg: "bg-rose-500/10", text: "text-rose-500", icon: XCircle },
  failed: { bg: "bg-rose-500/10", text: "text-rose-500", icon: XCircle },
  pending: { bg: "bg-amber-500/10", text: "text-amber-600", icon: AlertCircle },
  created: { bg: "bg-slate-500/10", text: "text-slate-600", icon: Clock },
};

function getStatusStyle(status: string) {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
}

export default function CustomerOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => api.get("/orders"),
  });

  const { data: orderDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["customer-order-details", selectedOrderId],
    queryFn: () => api.get(`/orders/${selectedOrderId}`),
    enabled: !!selectedOrderId,
  });

  // Computed stats
  const stats = useMemo(() => {
    const all = orders as any[];
    const totalSpent = all.filter((o: any) => o.status === "paid").reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
    const totalOrders = all.filter((o: any) => o.status === "paid" || o.status === "delivered").length;
    const paidCount = all.filter((o: any) => o.status === "paid").length;
    const pendingCount = all.filter((o: any) => o.status !== "paid" && o.status !== "cancelled" && o.status !== "failed").length;
    return { totalSpent, totalOrders, paidCount, pendingCount };
  }, [orders]);

  // Filtered orders
  const filtered = useMemo(() => {
    let result = orders as any[];
    if (statusFilter !== "all") result = result.filter((o: any) => o.status === statusFilter);
    if (search) result = result.filter((o: any) =>
      o.receipt?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase())
    );
    return result;
  }, [orders, statusFilter, search]);

  const generateInvoice = (order: any) => {
    if (!order || !order.items) {
      toast.error("Order details are incomplete.");
      return;
    }

    const htmlContent = `
      <html>
      <head>
        <title>Invoice - ${order.receipt}</title>
        <style>
          body { font-family: 'Inter', sans-serif; color: #1a1a1a; padding: 40px; margin: 0; max-width: 850px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f0f0f0; padding-bottom: 30px; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: 800; color: #000; letter-spacing: -1.5px; }
          .company-info { text-align: right; font-size: 14px; color: #666; }
          .billing { display: flex; justify-content: space-between; margin-bottom: 50px; }
          .bill-box { width: 48%; }
          .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #f0f0f0; padding-bottom: 5px; }
          .invoice-meta { text-align: right; }
          .title { font-size: 28px; font-weight: 800; text-transform: uppercase; color: #000; margin: 0 0 15px 0; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .table th { text-align: left; padding: 15px; background: #fafafa; font-size: 12px; font-weight: 700; color: #666; border-bottom: 1px solid #eee; }
          .table td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-section { display: flex; justify-content: flex-end; }
          .total-box { width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
          .grand-total { font-size: 20px; font-weight: 800; color: #000; border-bottom: none; padding-top: 20px; }
          .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #f0f0f0; padding-top: 30px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .status-paid { background: #e6fcf5; color: #0ca678; }
          @media print { body { padding: 0; } .logo { color: #000 !important; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="\${window.location.origin}\${logoIcon}" alt="Chauhan Computers" style="height: 60px; width: 60px; object-fit: contain; border-radius: 12px;" />
            <div>
              <div class="logo">CHAUHAN COMPUTERS</div>
              <div style="font-size: 14px; color: #888; font-weight: 500; margin-top: 5px;">Enterprise IT Solutions & Hardware</div>
            </div>
          </div>
          <div class="company-info">
            B-5 A, Vaibhav Enclave<br/>
            Girdhar Marg, Malviya Nagar<br/>
            Jaipur, Rajasthan 302017<br/>
            GSTIN: 08XXXXXXXXXXXXX
          </div>
        </div>

        <div class="billing">
          <div class="bill-box">
            <div class="label">Billed To</div>
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">${order.customer_name}</div>
            <div style="color: #666; font-size: 14px; line-height: 1.6;">
              ${order.customer_email}<br/>
              ${order.customer_phone}<br/>
              ${order.customer_address || ''}
            </div>
          </div>
          <div class="bill-box invoice-meta">
            <h1 class="title">Invoice</h1>
            <div style="margin-bottom: 8px;"><strong>Invoice No:</strong> INV-${order.receipt.split('_')[1]}</div>
            <div style="margin-bottom: 8px;"><strong>Date:</strong> ${format(new Date(order.created_at), 'MMMM dd, yyyy')}</div>
            <div><strong>Status:</strong> <span class="status status-paid">${order.status}</span></div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: any) => `
              <tr>
                <td style="font-weight: 600;">${item.product_name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.price.toLocaleString()}</td>
                <td style="text-align: right; font-weight: 600;">₹${(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-box">
            <div class="total-row">
              <span style="color: #888;">Subtotal</span>
              <span style="font-weight: 600;">₹${order.amount.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span style="color: #888;">Tax (0%)</span>
              <span style="font-weight: 600;">₹0</span>
            </div>
            <div class="total-row grand-total">
              <span>Amount Paid</span>
              <span>₹${order.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing Chauhan Computers for your technology needs.<br/>
          This is an electronic receipt. No signature required.
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); window.close(); }, 800);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Purchase Ledger</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Track your orders, download invoices, and manage purchase history.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-primary/10 rounded-xl text-xs font-bold text-primary border border-primary/20">
            {stats.totalOrders} Total Orders
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Spent", value: `₹${stats.totalSpent.toLocaleString()}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
          { label: "Completed", value: stats.paidCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Pending", value: stats.pendingCount, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "All Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or name..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-card border border-border/50 rounded-xl">
          {["all", "paid", "pending", "cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order List */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fetching Orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card/40 backdrop-blur-xl border border-border/50 border-dashed rounded-2xl">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-5">
                <Package className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No orders found</h3>
              <p className="text-muted-foreground text-sm max-w-xs text-center">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Your purchase history is currently empty."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium px-1">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
              {filtered.map((order: any, idx: number) => {
                const style = getStatusStyle(order.status);
                const StatusIcon = style.icon;
                const isSelected = selectedOrderId === order.id;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`group relative bg-card border transition-all duration-200 cursor-pointer rounded-xl p-4 hover:shadow-lg hover:shadow-black/5 ${
                      isSelected
                        ? "border-primary/50 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 mb-1">
                            <h4 className="text-sm font-bold text-foreground tracking-tight">Order #{order.receipt?.split('_')[1] || order.id.slice(0, 8)}</h4>
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                              <StatusIcon className="w-2.5 h-2.5" />
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {format(new Date(order.created_at), "MMM dd, yyyy")}
                            </span>
                            <span className="w-px h-3 bg-border" />
                            <span className="flex items-center gap-0.5 text-primary font-bold">
                              <IndianRupee className="w-3 h-3" />
                              {order.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 text-muted-foreground transition-all ${isSelected ? "translate-x-0.5 text-primary" : "group-hover:translate-x-0.5"}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedOrderId ? (
              <motion.div
                key={selectedOrderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="sticky top-24 bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl shadow-black/5"
              >
                {/* Decorative accent */}
                <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-500 to-primary/50" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground tracking-tight">Order Details</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                        #{orderDetails?.receipt?.split('_')[1] || selectedOrderId.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {orderDetails?.status === 'paid' && (
                        <button
                          onClick={() => generateInvoice(orderDetails)}
                          disabled={detailsLoading || !orderDetails}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                          title="Download Tax Invoice"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrderId(null)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {detailsLoading ? (
                    <div className="py-16 text-center">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Details</p>
                    </div>
                  ) : orderDetails ? (
                    <div className="space-y-6">
                      {/* Items */}
                      <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Purchased Items</h5>
                        <div className="space-y-2">
                          {orderDetails.items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl group hover:bg-muted/50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{item.product_name}</p>
                                <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                                  {item.quantity} × ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                              <p className="text-sm font-extrabold text-foreground ml-3 shrink-0">₹{(item.quantity * item.price).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Subtotal</span>
                          <span className="text-sm font-bold text-foreground">₹{orderDetails.amount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-medium text-muted-foreground">Tax</span>
                          <span className="text-sm font-bold text-foreground">₹0</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <span className="text-sm font-bold text-foreground">Total Paid</span>
                          <span className="text-2xl font-extrabold text-primary tracking-tight">₹{orderDetails.amount?.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Payment Status */}
                      {(() => {
                        const style = getStatusStyle(orderDetails.status);
                        const StatusIcon = style.icon;
                        return (
                          <div className={`${style.bg} rounded-xl p-4 border border-current/10`}>
                            <div className="flex items-center gap-2 mb-2">
                              <StatusIcon className={`w-4 h-4 ${style.text}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
                                {orderDetails.status === 'paid' ? 'Payment Verified' : 
                                 orderDetails.status === 'failed' ? 'Transaction Declined' : 
                                 orderDetails.status === 'created' ? 'Payment Incomplete (Session Closed)' : 
                                 orderDetails.status === 'cancelled' ? 'Transaction Cancelled' :
                                 'Payment Processing'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] text-muted-foreground">
                                <span className="font-semibold text-foreground/70">
                                  {orderDetails.status === 'created' ? "The payment window was closed before completion." : 
                                   orderDetails.status === 'failed' ? "The transaction was rejected by the bank or gateway." : 
                                   orderDetails.status === 'paid' ? "The transaction was successfully processed." : ""}
                                </span>
                              </p>
                              <div className="h-2" />
                              <p className="text-[11px] text-muted-foreground">
                                <span className="font-semibold">Transaction ID:</span>{" "}
                                <span className="text-foreground font-mono text-[10px]">{orderDetails.razorpay_payment_id || "None Issued"}</span>
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                <span className="font-semibold">Last Sync:</span>{" "}
                                <span className="text-foreground">{format(new Date(orderDetails.created_at), "MMMM dd, yyyy 'at' hh:mm a")}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Invoice not available for non-paid */}
                      {orderDetails.status !== 'paid' && (
                        <div className="text-center py-3 bg-muted/30 rounded-xl border border-border/50">
                          <FileText className="w-5 h-5 text-muted-foreground/40 mx-auto mb-1.5" />
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invoice available after payment</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <div className="sticky top-24 bg-card/40 backdrop-blur-xl border border-border/50 border-dashed rounded-2xl p-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-10 h-10 text-primary/25" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">Select an Order</h4>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                  Click on any purchase record to view item breakdown, payment status, and download your tax invoice.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
