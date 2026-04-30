import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Save, ShieldCheck } from "lucide-react";

export default function CustomerProfile() {
  const { profile, user } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    address: profile?.address || "",
  });

  const updateMutation = useMutation({
    mutationFn: () => api.put(`/users/${user!.id}`, form),
    onSuccess: () => toast.success("Profile updated successfully", {
      description: "Your personal details have been securely saved."
    }),
    onError: () => toast.error("Failed to update profile", {
      description: "Please try again later or contact support."
    })
  });

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 border border-primary/10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary/60 p-1 shadow-xl shadow-primary/20 shrink-0">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-4 border-card">
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 uppercase">
                {profile?.full_name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          <div className="text-center md:text-left pt-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-1">{profile?.full_name || "Update Profile"}</h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Account Setup
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-10 shadow-xl shadow-black/5"
      >
        <h3 className="text-lg font-bold mb-6 text-foreground">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <div className="relative group">
              <input 
                value={form.full_name} 
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} 
                className="w-full px-4 py-3.5 bg-background/50 rounded-xl text-sm font-medium text-foreground border border-border/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:border-border" 
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </label>
            <div className="relative group">
              <input 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                className="w-full px-4 py-3.5 bg-background/50 rounded-xl text-sm font-medium text-foreground border border-border/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:border-border" 
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <div className="relative group">
              <input 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                className="w-full px-4 py-3.5 bg-background/50 rounded-xl text-sm font-medium text-foreground border border-border/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:border-border" 
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Shipping Address
            </label>
            <div className="relative group">
              <textarea 
                value={form.address} 
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))} 
                rows={3} 
                className="w-full px-4 py-3.5 bg-background/50 rounded-xl text-sm font-medium text-foreground border border-border/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:border-border resize-none" 
                placeholder="Enter your full shipping address..."
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end border-t border-border/50 pt-6">
          <button 
            onClick={() => updateMutation.mutate()} 
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {updateMutation.isPending ? "Saving..." : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
