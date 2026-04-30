import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Image, X, Upload } from "lucide-react";

const PAGES = ["home", "about", "services", "category", "contact"];
const BANNER_TYPES = ["hero", "promo"];

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterPage, setFilterPage] = useState("all");
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", cta_text: "Shop Now", cta_link: "/", page: "home", position: 0, is_active: true, banner_type: "hero" });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: () => api.get("/banners/all"),
  });

  const saveMutation = useMutation({
    mutationFn: (banner: any) => editing ? api.put(`/banners/${editing.id}`, banner) : api.post("/banners", banner),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-banners"] }); toast.success(editing ? "Banner updated" : "Banner created"); resetForm(); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/banners/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-banners"] }); toast.success("Banner deleted"); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => api.put(`/banners/${id}`, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  const resetForm = () => {
    setEditing(null); setShowForm(false);
    setForm({ title: "", subtitle: "", image_url: "", cta_text: "Shop Now", cta_link: "/", page: "home", position: 0, is_active: true, banner_type: "hero" });
  };

  const startEdit = (b: any) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle || "", image_url: b.image_url, cta_text: b.cta_text || "", cta_link: b.cta_link || "/", page: b.page, position: b.position, is_active: b.is_active, banner_type: b.banner_type });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [url] = await api.uploadFiles([file]);
      setForm(f => ({ ...f, image_url: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
  };

  const filtered = filterPage === "all" ? banners : (banners as any[]).filter((b: any) => b.page === filterPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground">Manage hero & promo banners across all pages</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", ...PAGES].map(p => (
          <button key={p} onClick={() => setFilterPage(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filterPage === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{p}</button>
        ))}
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Banner" : "New Banner"}</h2>
          <form onSubmit={e => { e.preventDefault(); if (!form.image_url) { toast.error("Image URL is required"); return; } saveMutation.mutate(form); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" placeholder="Banner title" /></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Subtitle</label><input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" /></div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Banner Image</label>
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors relative group">
                {form.image_url ? (
                  <div className="relative w-full aspect-[4/1] rounded-lg overflow-hidden">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image_url: "" }))} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer py-4 w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-foreground">Click to upload banner</p>
                      <p className="text-[10px] text-muted-foreground">JPG, PNG or WEBP (Max 2MB)</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">CTA Text</label><input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">CTA Link</label><input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Page</label><select value={form.page} onChange={e => setForm(f => ({ ...f, page: e.target.value }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm">{PAGES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label><select value={form.banner_type} onChange={e => setForm(f => ({ ...f, banner_type: e.target.value }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm">{BANNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Position</label><input type="number" value={form.position} onChange={e => setForm(f => ({ ...f, position: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 bg-background rounded-lg border border-border text-sm" /></div>
            </div>
            <div className="md:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active</label>
              <div className="flex-1" />
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={saveMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">{saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (filtered as any[]).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No banners found.</div>
      ) : (
        <div className="space-y-3">
          {(filtered as any[]).map((b: any) => (
            <div key={b.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-3">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <img src={b.image_url} alt={b.title} className="w-24 h-14 rounded-lg object-cover shrink-0 bg-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{b.title || "(No title)"}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize bg-muted px-1.5 py-0.5 rounded">{b.page}</span>
                  <span className="capitalize bg-muted px-1.5 py-0.5 rounded">{b.banner_type}</span>
                  <span>Pos: {b.position}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleMutation.mutate({ id: b.id, is_active: !b.is_active })} className={`p-2 rounded-lg ${b.is_active ? "text-primary" : "text-muted-foreground"} hover:bg-muted`}>{b.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                <button onClick={() => startEdit(b)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete this banner?")) deleteMutation.mutate(b.id); }} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
