import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Package, Download, Eye, IndianRupee, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function CustomerOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => api.get("/orders"),
  });

  const { data: orderDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["customer-order-details", selectedOrderId],
    queryFn: () => api.get(`/orders/${selectedOrderId}`),
    enabled: !!selectedOrderId,
  });

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
          <div>
            <div class="logo">CHAUHAN COMPUTERS</div>
            <div style="font-size: 14px; color: #888; font-weight: 500; margin-top: 5px;">Enterprise IT Solutions & Hardware</div>
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
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Purchase Ledger</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage your hardware acquisitions and tax documents.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Fetching Orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card/40 backdrop-blur-xl border border-border/50 border-dashed rounded-3xl">
              <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground text-sm max-w-xs text-center">Your purchase history is currently empty. Ready to upgrade your hardware?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any, idx: number) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`group relative overflow-hidden bg-card/40 backdrop-blur-xl border transition-all duration-300 cursor-pointer rounded-2xl p-5 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 ${selectedOrderId === order.id ? 'border-primary shadow-lg shadow-primary/5 bg-card/60' : 'border-border/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedOrderId === order.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-base font-bold text-foreground tracking-tight">#{order.receipt.split('_')[1]}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(order.created_at), "MMM dd, yyyy")}</span>
                          <span className="flex items-center gap-1 text-primary font-bold"><IndianRupee className="w-3 h-3" /> {order.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${selectedOrderId === order.id ? 'translate-x-1 text-primary' : ''}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedOrderId ? (
              <motion.div 
                key={selectedOrderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="sticky top-24 bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-foreground tracking-tight">Order Insight</h3>
                    <button 
                      onClick={() => generateInvoice(orderDetails)}
                      disabled={detailsLoading || !orderDetails}
                      className="p-3 bg-primary text-primary-foreground rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 shadow-lg shadow-primary/20"
                      title="Download Tax Invoice"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>

                  {detailsLoading ? (
                    <div className="py-20 text-center">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Details</p>
                    </div>
                  ) : orderDetails ? (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Purchased Items</h5>
                        <div className="space-y-3">
                          {orderDetails.items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center group">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{item.product_name}</p>
                                <p className="text-[10px] font-medium text-muted-foreground">{item.quantity} Unit{item.quantity > 1 ? 's' : ''} × ₹{item.price.toLocaleString()}</p>
                              </div>
                              <p className="text-sm font-black text-foreground ml-4 shrink-0">₹{(item.quantity * item.price).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border/50 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-muted-foreground">Order Total</span>
                          <span className="text-xl font-black text-primary tracking-tight">₹{orderDetails.amount.toLocaleString()}</span>
                        </div>
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border/30">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Payment Secured</span>
                          </div>
                          <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                            Transactional ID: <span className="text-foreground">{orderDetails.razorpay_payment_id || "Processing"}</span><br/>
                            Payment Status: <span className="text-emerald-500 font-bold uppercase">{orderDetails.status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <div className="sticky top-24 bg-card/40 backdrop-blur-xl border border-border/50 border-dashed rounded-3xl p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary/30" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">Select an Order</h4>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                  Click on any purchase record to view detailed breakdowns and download your official tax invoice.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
