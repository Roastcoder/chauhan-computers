import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Upload, Eye, EyeOff } from "lucide-react";
import { services as defaultServices } from "@/lib/data";

interface Service { id: string; name: string; description: string; image_url: string; visible: boolean; icon?: string; }

const empty = (): Service => ({ id: crypto.randomUUID(), name: "", description: "", image_url: "", visible: true });

export default function AdminServices() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const saved: Service[] = (settings as any[]).find((s: any) => s.key === "services_config")?.value || [];

  const [items, setItems] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Service>(empty());
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (saved.length > 0) {
      setItems(saved);
    } else if (defaultServices.length > 0) {
      // Pre-populate with default services from website
      const initialServices = defaultServices.map(svc => ({
        id: svc.id,
        name: svc.name,
        description: svc.description,
        image_url: svc.image,
        visible: true,
        icon: svc.icon
      }));
      setItems(initialServices);
    }
  }, [(settings as any[]).length]);

  const saveMutation = useMutation({
    mutationFn: (list: Service[]) => api.put("/settings/services_config", { value: list }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["crm-settings"] }); toast.success("Services saved"); },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const [url] = await api.uploadFiles([file]);
      setEditForm(f => ({ ...f, image_url: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const startEdit = (s: Service) => { setEditingId(s.id); setEditForm({ ...s }); };
  const startAdd = () => { const n = empty(); setItems(prev => [...prev, n]); setEditingId(n.id); setEditForm(n); };

  const confirmEdit = () => {
    if (!editForm.name) { toast.error("Name required"); return; }
    const updated = items.map(s => s.id === editingId ? editForm : s);
    setItems(updated);
    setEditingId(null);
    saveMutation.mutate(updated);
  };

  const cancelEdit = () => {
    setItems(prev => prev.filter(s => s.id !== editingId || saved.some(sv => sv.id === s.id)));
    setEditingId(null);
  };

  const remove = (id: string) => {
    const updated = items.filter(s => s.id !== id);
    setItems(updated);
    saveMutation.mutate(updated);
  };

  const toggleVisible = (id: string) => {
    const updated = items.map(s => s.id === id ? { ...s, visible: !s.visible } : s);
    setItems(updated);
    saveMutation.mutate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the services shown on the Services page</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Add Service
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No services configured. Add one above.</p>}
        {items.map(s => (
          <div key={s.id} className={`bg-card border rounded-xl p-4 ${s.visible ? "border-border" : "border-border/40 opacity-60"}`}>
            {editingId === s.id ? (
              <div className="space-y-3">
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Service Name *" className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none" />
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none resize-none" />
                <div className="flex gap-2">
                  <input value={editForm.image_url} onChange={e => setEditForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Image URL" className="flex-1 px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none" />
                  <label className="flex items-center gap-1 px-3 py-2 bg-muted rounded-lg text-xs cursor-pointer hover:bg-muted/80">
                    <Upload className="w-3.5 h-3.5" /> {uploading ? "..." : "Upload"}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                </div>
                {editForm.image_url && <img src={editForm.image_url} alt="" className="h-24 rounded-lg object-cover" />}
                <div className="flex gap-2">
                  <button onClick={confirmEdit} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"><Check className="w-3.5 h-3.5" /> Save</button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-xs"><X className="w-3.5 h-3.5" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => toggleVisible(s.id)} className={`p-1.5 rounded-lg ${s.visible ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}>
                    {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
