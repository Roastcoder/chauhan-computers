import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Package, Download, Eye, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.get("/orders"),
  });

  const { data: orderDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["admin-order-details", selectedOrder?.id],
    queryFn: () => api.get(`/orders/${selectedOrder.id}`),
    enabled: !!selectedOrder,
  });

  const generateInvoice = (order: any) => {
    if (!order || !order.items) {
      toast.error("Order details are incomplete for invoice generation.");
      return;
    }

    const htmlContent = `
      <html>
      <head>
        <title>Invoice - ${order.receipt}</title>
        <style>
          body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #333; line-height: 1.5; padding: 40px; margin: 0; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #222; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: 800; color: #111; letter-spacing: -1px; }
          .company-details { text-align: right; font-size: 13px; color: #555; }
          .invoice-title { font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #222; margin-top: 0; }
          .billing-info { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .bill-to, .invoice-details { width: 45%; }
          h3 { font-size: 14px; text-transform: uppercase; color: #777; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
          .table th { background-color: #f8f9fa; font-weight: 600; font-size: 13px; text-transform: uppercase; color: #555; }
          .table td { font-size: 14px; }
          .text-right { text-align: right !important; }
          .total-row { font-weight: bold; background-color: #f8f9fa; }
          .total-row td { border-bottom: none; border-top: 2px solid #222; font-size: 16px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Chauhan Computers</div>
            <div style="margin-top: 5px; font-size: 12px; color: #666;">Premium IT Hardware & Services</div>
          </div>
          <div class="company-details">
            B-5 A, Vaibhav Enclave<br/>
            Near Indian Bank, Girdhar Marg<br/>
            Malviya Nagar, Jaipur - 302017<br/>
            Phone: 95093 17543
          </div>
        </div>

        <div class="billing-info">
          <div class="bill-to">
            <h3>Billed To</h3>
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${order.customer_name || 'Customer'}</div>
            <div style="font-size: 14px; color: #555;">
              ${order.customer_email || 'N/A'}<br/>
              Phone: ${order.customer_phone || 'N/A'}<br/>
              ${order.customer_address ? order.customer_address.replace(/\\n/g, '<br/>') : ''}
            </div>
          </div>
          <div class="invoice-details text-right">
            <h2 class="invoice-title">Tax Invoice</h2>
            <div style="margin-bottom: 5px;"><strong>Receipt No:</strong> ${order.receipt}</div>
            <div style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id}</div>
            <div style="margin-bottom: 5px;"><strong>Date:</strong> ${format(new Date(order.created_at), 'dd MMM, yyyy')}</div>
            <div><strong>Payment Status:</strong> ${order.status.toUpperCase()}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: any, i: number) => `
              <tr>
                <td>${i + 1}</td>
                <td>${item.product_name || 'Custom Item'}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">₹${item.price.toLocaleString()}</td>
                <td class="text-right">₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="4" class="text-right">Grand Total</td>
              <td class="text-right">₹${order.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 40px;">
          <h3>Terms & Conditions</h3>
          <ul style="font-size: 12px; color: #555; padding-left: 20px;">
            <li>All goods returned must be in original condition and packaging.</li>
            <li>Warranty is subject to manufacturer terms and conditions.</li>
            <li>Subject to Jaipur jurisdiction only.</li>
          </ul>
        </div>

        <div class="footer">
          This is a computer generated invoice and does not require a physical signature.<br/>
          Thank you for shopping with Chauhan Computers!
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      toast.error("Please allow popups to generate invoices.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage customer orders and generate invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No orders have been placed yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order: any) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedOrder?.id === order.id ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground">{order.receipt}</p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{order.customer_name} ({order.customer_email})</p>
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(order.created_at), "PPp")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-sm font-bold text-primary flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        {order.amount.toLocaleString()}
                      </div>
                      <button className="text-xs font-medium text-muted-foreground flex items-center hover:text-foreground">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedOrder ? (
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-1">Order Details</h3>
                  <p className="text-xs text-muted-foreground">Receipt: {selectedOrder.receipt}</p>
                </div>
                {selectedOrder.status === 'paid' && (
                  <button 
                    onClick={() => generateInvoice(orderDetails)}
                    disabled={detailsLoading || !orderDetails}
                    className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Download className="w-4 h-4" /> Invoice
                  </button>
                )}
              </div>

              {detailsLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading details...</div>
              ) : orderDetails ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Info</h4>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{orderDetails.customer_name}</p>
                      <p className="text-muted-foreground">{orderDetails.customer_email}</p>
                      <p className="text-muted-foreground">{orderDetails.customer_phone || "No phone provided"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</h4>
                    <div className="space-y-3">
                      {orderDetails.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-start text-sm bg-muted/30 p-2 rounded-md">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                          </div>
                          <p className="font-semibold">₹{(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-border flex justify-between items-center font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary text-lg">₹{orderDetails.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Details</h4>
                    <div className="text-xs space-y-1 bg-muted/50 p-3 rounded-lg border border-border">
                      <p><span className="text-muted-foreground w-20 inline-block">Order ID:</span> {orderDetails.id}</p>
                      <p><span className="text-muted-foreground w-20 inline-block">Payment ID:</span> {orderDetails.razorpay_payment_id || "N/A"}</p>
                      <p><span className="text-muted-foreground w-20 inline-block">Status:</span> <span className="uppercase font-semibold">{orderDetails.status}</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">Failed to load order details</div>
              )}
            </div>
          ) : (
            <div className="bg-muted/30 border border-border border-dashed rounded-xl p-8 text-center sticky top-24 flex flex-col items-center">
              <Eye className="w-8 h-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Select an order from the list to view its details and generate invoice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
