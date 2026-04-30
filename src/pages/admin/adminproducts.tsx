import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Upload, X, Image, Search, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { accessorySubtypes } from "@/lib/data";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "dell-laptop", label: "Dell Laptop" },
  { value: "hp-laptop", label: "HP Laptop" },
  { value: "lenovo-laptop", label: "Lenovo Laptop" },
  { value: "macbook", label: "MacBook" },
  { value: "cpu-desktop", label: "CPU / Desktop" },
  { value: "printers", label: "Printers" },
  ...accessorySubtypes.map(s => ({ value: s.value, label: s.label })),
];

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["crm-products"],
    queryFn: () => api.get("/products/all"),
  });

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const lowStockThreshold = (settings as any[]).find((s: any) => s.key === "inventory_config")?.value?.low_stock_threshold ?? 5;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["crm-products"] }); toast.success("Product deleted"); },
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => api.put(`/products/${id}`, { is_active: !is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm-products"] }),
  });

  const filtered = (products as any[]).filter((p: any) => {
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (stockFilter === "low" && p.stock_quantity > lowStockThreshold) return false;
    if (stockFilter === "out" && p.stock_quantity > 0) return false;
    if (stockFilter === "active" && !p.is_active) return false;
    if (stockFilter === "inactive" && p.is_active) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = (products as any[]).filter((p: any) => p.stock_quantity <= lowStockThreshold && p.stock_quantity > 0).length;
  const outOfStockCount = (products as any[]).filter((p: any) => p.stock_quantity === 0).length;

  const catLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label ?? cat;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Products</h1>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[11px] font-bold">
          <Plus className="w-3 h-3" /> Add Product
        </button>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex flex-wrap gap-2">
          {lowStockCount > 0 && (
            <button onClick={() => setStockFilter("low")} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-lg text-xs font-medium border border-yellow-500/20 hover:bg-yellow-500/20">
              <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} low stock (≤{lowStockThreshold})
            </button>
          )}
          {outOfStockCount > 0 && (
            <button onClick={() => setStockFilter("out")} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium border border-red-500/20 hover:bg-red-500/20">
              <AlertTriangle className="w-3.5 h-3.5" /> {outOfStockCount} out of stock
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
          <option value="all">All Stock</option>
          <option value="low">Low Stock (≤{lowStockThreshold})</option>
          <option value="out">Out of Stock</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <p className="text-muted-foreground col-span-3">Loading...</p>}
        {filtered.map((product: any) => (
          <ProductCardInline key={product.id} product={product} lowStockThreshold={lowStockThreshold} toggleActive={toggleActive} deleteMutation={deleteMutation} setEditProduct={setEditProduct} setShowModal={setShowModal} catLabel={catLabel} />
        ))}
      </div>

      <AnimatePresence>
        {showModal && <ProductModal product={editProduct} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ProductCardInline({ product, lowStockThreshold, toggleActive, deleteMutation, setEditProduct, setShowModal, catLabel }: any) {
  const queryClient = useQueryClient();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [tempPrice, setTempPrice] = useState(product.price.toString());
  const [tempStock, setTempStock] = useState(product.stock_quantity.toString());

  const updateMutation = useMutation({
    mutationFn: (updates: any) => api.put(`/products/${product.id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      toast.success("Product updated");
    },
    onError: () => {
      toast.error("Update failed");
      setTempPrice(product.price.toString());
      setTempStock(product.stock_quantity.toString());
    }
  });

  const handlePriceBlur = () => {
    setIsEditingPrice(false);
    if (Number(tempPrice) !== product.price) {
      updateMutation.mutate({ price: Number(tempPrice) });
    }
  };

  const handleStockBlur = () => {
    setIsEditingStock(false);
    if (Number(tempStock) !== product.stock_quantity) {
      updateMutation.mutate({ stock_quantity: Number(tempStock) });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`bg-card border rounded-xl overflow-hidden transition-opacity ${!product.is_active ? "opacity-50 border-border/40" : product.stock_quantity <= lowStockThreshold && product.stock_quantity > 0 ? "border-yellow-500/40" : product.stock_quantity === 0 ? "border-red-500/40" : "border-border"}`}>
      {product.images?.[0] ? (
        <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-muted flex items-center justify-center">
          <Image className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.brand} · {catLabel(product.category)}</p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
            {isEditingStock ? (
              <input
                autoFocus
                type="number"
                value={tempStock}
                onChange={(e) => setTempStock(e.target.value)}
                onBlur={handleStockBlur}
                onKeyDown={(e) => e.key === "Enter" && handleStockBlur()}
                className="w-16 px-1.5 py-0.5 text-[10px] font-semibold bg-background border border-primary rounded outline-none"
              />
            ) : (
              <button
                onClick={() => setIsEditingStock(true)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors hover:ring-1 hover:ring-primary/30 ${
                  product.stock_quantity === 0 ? "bg-red-100 text-red-600" : 
                  product.stock_quantity <= lowStockThreshold ? "bg-yellow-100 text-yellow-700" : 
                  "bg-emerald-100 text-emerald-700"
                }`}
              >
                {product.stock_quantity === 0 ? "Out of Stock" : 
                 product.stock_quantity <= lowStockThreshold ? `Low: ${product.stock_quantity}` : 
                 `Stock: ${product.stock_quantity}`}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {isEditingPrice ? (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">₹</span>
              <input
                autoFocus
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                onBlur={handlePriceBlur}
                onKeyDown={(e) => e.key === "Enter" && handlePriceBlur()}
                className="w-24 px-1.5 py-0.5 text-lg font-bold text-primary bg-background border border-primary rounded outline-none"
              />
            </div>
          ) : (
            <p 
              onClick={() => setIsEditingPrice(true)}
              className="text-lg font-bold text-primary cursor-pointer hover:text-primary/80 transition-colors"
            >
              ₹{Number(product.price).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setEditProduct(product); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-background rounded-lg text-xs text-foreground hover:bg-muted transition-colors">
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button onClick={() => toggleActive.mutate({ id: product.id, is_active: product.is_active })} className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs transition-colors ${product.is_active ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {product.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
          <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(product.id); }} className="flex items-center justify-center gap-1 py-2 px-3 bg-destructive/10 rounded-lg text-xs text-destructive hover:bg-destructive/20 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "dell-laptop",
    brand: product?.brand || "",
    price: product?.price || 0,
    original_price: product?.specs?.originalPrice || "",
    description: product?.description || "",
    stock_quantity: product?.stock_quantity || 0,
    badge: product?.specs?.badge || "",
    specs: product?.specs || {},
    is_active: product?.is_active !== false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await api.uploadFiles(Array.from(files));
      setImageUrls(prev => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const mutation = useMutation({
    mutationFn: () => {
      const specs = { ...form.specs, badge: form.badge || undefined, originalPrice: form.original_price ? Number(form.original_price) : undefined };
      const payload = { ...form, price: Number(form.price) || 0, images: imageUrls, specs };
      if (product) return api.put(`/products/${product.id}`, payload);
      return api.post("/products", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-products"] });
      queryClient.invalidateQueries({ queryKey: ["public-products"] });
      toast.success(product ? "Product updated" : "Product added");
      onClose();
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product Name *" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
            <option value="dell-laptop">Dell Laptop</option>
            <option value="hp-laptop">HP Laptop</option>
            <option value="lenovo-laptop">Lenovo Laptop</option>
            <option value="macbook">MacBook</option>
            <option value="cpu-desktop">CPU / Desktop</option>
            <option value="printers">Printers</option>
            <optgroup label="Accessories">
              {accessorySubtypes.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </optgroup>
          </select>
          <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Price (₹)" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
            <input type="text" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="Original Price (₹)" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} placeholder="Stock Qty" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
            <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Badge (e.g. Popular, New)" className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
          </div>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none resize-none" />
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
            Active (visible on website)
          </label>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Product Images</label>
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors bg-muted/20">
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-semibold">{uploading ? "..." : "Upload"}</span>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 italic">Images are uploaded directly to the server</p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 bg-background text-foreground rounded-xl text-sm border border-border">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!form.name || mutation.isPending} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
