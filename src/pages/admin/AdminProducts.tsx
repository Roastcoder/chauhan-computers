import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["crm-products"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_products").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("crm_products").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      toast.success("Product deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <p className="text-muted-foreground col-span-3">Loading...</p>}
        {products.map(product => (
          <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
            {product.images?.[0] && (
              <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.brand} · {product.category}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${(product.stock_quantity || 0) > 0 ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
                  {(product.stock_quantity || 0) > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <p className="text-lg font-bold text-primary mb-3">₹{Number(product.price).toLocaleString()}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditProduct(product); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-background rounded-lg text-xs text-foreground hover:bg-muted transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(product.id); }} className="flex items-center justify-center gap-1 py-2 px-3 bg-destructive/10 rounded-lg text-xs text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && <ProductModal product={editProduct} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "Laptop",
    brand: product?.brand || "",
    price: product?.price || 0,
    description: product?.description || "",
    stock_quantity: product?.stock_quantity || 0,
    specs: product?.specs || {},
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (product) {
        await supabase.from("crm_products").update(form).eq("id", product.id);
      } else {
        await supabase.from("crm_products").insert(form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      toast.success(product ? "Product updated" : "Product added");
      onClose();
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product Name *" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
            <option>Laptop</option><option>Desktop</option><option>Accessory</option><option>Printer</option>
          </select>
          <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="Price" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} placeholder="Stock Quantity" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-background text-foreground rounded-xl text-sm">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!form.name} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
