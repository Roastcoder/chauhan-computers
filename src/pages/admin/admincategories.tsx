import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GripVertical, Eye, EyeOff, Pencil, Check, X } from "lucide-react";
import { categories as defaultCategories, accessorySubtypes } from "@/lib/data";

const ALL_CATEGORIES = [
  ...defaultCategories.map(c => ({ value: c.slug, label: c.name, subtitle: c.subtitle })),
  ...accessorySubtypes.map(s => ({ value: s.value, label: s.label, subtitle: "Accessories" })),
];

export default function AdminCategories() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const catConfig: Record<string, any> = (settings as any[]).find((s: any) => s.key === "categories_config")?.value || {};

  const [items, setItems] = useState(
    ALL_CATEGORIES.map(c => ({
      ...c,
      visible: catConfig[c.value]?.visible !== false,
      customLabel: catConfig[c.value]?.customLabel || c.label,
      customSubtitle: catConfig[c.value]?.customSubtitle || c.subtitle,
    }))
  );
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");

  useEffect(() => {
    if (Object.keys(catConfig).length > 0) {
      setItems(ALL_CATEGORIES.map(c => ({
        ...c,
        visible: catConfig[c.value]?.visible !== false,
        customLabel: catConfig[c.value]?.customLabel || c.label,
        customSubtitle: catConfig[c.value]?.customSubtitle || c.subtitle,
      })));
    }
  }, [(settings as any[]).length]);

  const saveMutation = useMutation({
    mutationFn: (updated: typeof items) => {
      const val = updated.reduce((acc, item) => ({
        ...acc,
        [item.value]: { visible: item.visible, customLabel: item.customLabel, customSubtitle: item.customSubtitle },
      }), {});
      return api.put("/settings/categories_config", { value: val });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["crm-settings"] }); toast.success("Categories saved"); },
  });

  const toggleVisible = (idx: number) => {
    const updated = items.map((item, i) => i === idx ? { ...item, visible: !item.visible } : item);
    setItems(updated);
    saveMutation.mutate(updated);
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditLabel(items[idx].customLabel);
    setEditSubtitle(items[idx].customSubtitle);
  };

  const confirmEdit = (idx: number) => {
    const updated = items.map((item, i) => i === idx ? { ...item, customLabel: editLabel, customSubtitle: editSubtitle } : item);
    setItems(updated);
    setEditingIdx(null);
    saveMutation.mutate(updated);
  };

  const mainCats = items.filter(i => defaultCategories.some(c => c.slug === i.value));
  const accCats = items.filter(i => accessorySubtypes.some(s => s.value === i.value));

  const renderRow = (item: typeof items[0], idx: number) => (
    <div key={item.value} className={`flex items-center gap-3 p-3 rounded-xl border ${item.visible ? "border-border bg-card" : "border-border/40 bg-muted/30 opacity-60"}`}>
      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        {editingIdx === idx ? (
          <div className="flex flex-col gap-1.5">
            <input value={editLabel} onChange={e => setEditLabel(e.target.value)} className="px-3 py-1.5 bg-background rounded-lg text-sm border border-border outline-none w-full" placeholder="Display name" />
            <input value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} className="px-3 py-1.5 bg-background rounded-lg text-xs border border-border outline-none w-full" placeholder="Subtitle" />
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">{item.customLabel}</p>
            <p className="text-xs text-muted-foreground">{item.customSubtitle} · <span className="font-mono text-[10px]">/category/{item.value}</span></p>
          </>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {editingIdx === idx ? (
          <>
            <button onClick={() => confirmEdit(idx)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-500/10"><Check className="w-4 h-4" /></button>
            <button onClick={() => setEditingIdx(null)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
          </>
        ) : (
          <>
            <button onClick={() => startEdit(idx)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={() => toggleVisible(idx)} className={`p-1.5 rounded-lg ${item.visible ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}>
              {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit display names, subtitles, and visibility for all categories</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Main Categories</h3>
        {mainCats.map(item => renderRow(item, items.indexOf(item)))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Accessory Subtypes</h3>
        {accCats.map(item => renderRow(item, items.indexOf(item)))}
      </div>
    </div>
  );
}
