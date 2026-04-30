import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { api } from "@/integrations/supabase/client";
import { AnimatedSection } from "@/components/AnimatedSection";
import { toast } from "sonner";

import { SEO } from "@/components/SEO";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [orderComplete, setOrderComplete] = useState(false);

  // If cart is empty and order not complete, redirect to cart
  if (items.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error("Please fill in all address details");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const orderData = await api.post("/orders", {
        amount: total,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        shipping_address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        customer_phone: address.phone,
        items: items.map(i => ({
          product_id: i.product.id,
          price: i.product.price,
          quantity: i.quantity
        }))
      });

      // 2. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use key from env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Chauhan Computers",
        description: "Test Transaction",
        image: "https://via.placeholder.com/150", // Optional logo
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            const verifyData = await api.post("/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              toast.success("Payment successful!");
              clearCart();
              setOrderComplete(true);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: user.full_name || "Customer",
          email: user.email,
          contact: address.phone,
        },
        theme: {
          color: "#0f172a", // Primary color (slate-900)
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <SEO title="Order Confirmed" description="Thank you for your purchase from Chauhan Computers. Your order has been placed successfully." />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Thank you for your purchase. Your order has been placed successfully and we will process it right away.
        </p>
        <Link
          to="/"
          className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Checkout" description="Securely complete your purchase of laptops and tech accessories at Chauhan Computers." />
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <AnimatedSection>
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-8">Checkout</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-3xl p-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Shipping Information</h2>
              <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Jaipur"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">State</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Rajasthan"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Pincode</label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="302001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-surface rounded-3xl p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium text-foreground tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground tabular-nums">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground tabular-nums text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{total.toLocaleString()}
                  </>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                Secure Payments by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
