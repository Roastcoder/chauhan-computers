import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Check, X } from "lucide-react";
import { testimonials as defaultTestimonials } from "@/lib/data";

interface Testimonial { id: string; name: string; role: string; text: string; rating: number; visible?: boolean; }

const empty = (): Testimonial => ({ id: crypto.randomUUID(), name: "", role: "", text: "", rating: 5, visible: true });

export default function AdminTestimonials() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const saved: Testimonial[] = (settings as any[]).find((s: any) => s.key === "testimonials")?.value || [];

  const [items, setItems] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Testimonial>(empty());

  useEffect(() => {
    if (saved.length > 0) {
      setItems(saved);
    } else if (defaultTestimonials.length > 0) {
      // Pre-populate with default testimonials from website
      const initialTestimonials = defaultTestimonials.map((t, idx) => ({
        id: `testimonial-${idx}`,
        name: t.name,
        role: t.role,
        text: t.text,
        rating: t.rating,
        visible: true
      }));
      setItems(initialTestimonials);
    }
  }, [(settings as any[]).length]);

  const saveMutation = useMutation({
    mutationFn: (list: Testimonial[]) => api.put("/settings/testimonials", { value: list }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["crm-settings"] }); toast.success("Testimonials saved"); },
  });

  const startEdit = (t: Testimonial) => { setEditingId(t.id); setEditForm({ ...t }); };
  const startAdd = () => { const n = empty(); setItems(prev => [...prev, n]); setEditingId(n.id); setEditForm(n); };

  const confirmEdit = () => {
    if (!editForm.name || !editForm.text) { toast.error("Name and text required"); return; }
    const updated = items.map(t => t.id === editingId ? editForm : t);
    setItems(updated);
    setEditingId(null);
    saveMutation.mutate(updated);
  };

  const cancelEdit = () => {
    setItems(prev => prev.filter(t => t.id !== editingId || saved.some(s => s.id === t.id)));
    setEditingId(null);
  };

  const remove = (id: string) => {
    const updated = items.filter(t => t.id !== id);
    setItems(updated);
    saveMutation.mutate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer reviews shown on the homepage</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Add Testimonial
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No testimonials yet.</p>}
        {items.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-4">
            {editingId === t.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Customer Name *" className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none" />
                  <input value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} placeholder="Role / Title" className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none" />
                </div>
                <textarea value={editForm.text} onChange={e => setEditForm(f => ({ ...f, text: e.target.value }))} placeholder="Review text *" rows={3} className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none resize-none" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rating:</span>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setEditForm(f => ({ ...f, rating: n }))}>
                      <Star className={`w-4 h-4 ${n <= editForm.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={confirmEdit} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"><Check className="w-3.5 h-3.5" /> Save</button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-xs"><X className="w-3.5 h-3.5" /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">· {t.role}</p>}
                    <div className="flex ml-auto">
                      {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.text}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(t)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
