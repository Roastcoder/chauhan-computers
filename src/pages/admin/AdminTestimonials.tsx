import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Check, X, RefreshCw, Eye, EyeOff, Download } from "lucide-react";
import { testimonials as defaultTestimonials } from "@/lib/data";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  visible: boolean;
  source?: "manual" | "google";
  google_review_id?: string;
}

const empty = (): Testimonial => ({
  id: crypto.randomUUID(),
  name: "",
  role: "",
  text: "",
  rating: 5,
  visible: true,
  source: "manual",
});

export default function AdminTestimonials() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const saved: Testimonial[] = (settings as any[]).find((s: any) => s.key === "testimonials")?.value || [];

  const [items, setItems] = useState<Testimonial[]>(() => {
    if (saved.length > 0) return saved;
    // Pre-populate with default testimonials
    return defaultTestimonials.map((t, idx) => ({
      id: `testimonial-${idx}`,
      name: t.name,
      role: t.role,
      text: t.text,
      rating: t.rating,
      visible: true,
      source: "manual" as const,
    }));
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Testimonial>(empty());
  const [fetchingGoogle, setFetchingGoogle] = useState(false);
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (list: Testimonial[]) => api.put("/settings/testimonials", { value: list }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Testimonials saved");
    },
  });

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setEditForm({ ...t });
  };

  const startAdd = () => {
    const n = empty();
    setItems((prev) => [...prev, n]);
    setEditingId(n.id);
    setEditForm(n);
  };

  const confirmEdit = () => {
    if (!editForm.name || !editForm.text) {
      toast.error("Name and text required");
      return;
    }
    const updated = items.map((t) => (t.id === editingId ? editForm : t));
    setItems(updated);
    setEditingId(null);
    saveMutation.mutate(updated);
  };

  const cancelEdit = () => {
    setItems((prev) => prev.filter((t) => t.id !== editingId || saved.some((s) => s.id === t.id)));
    setEditingId(null);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const updated = items.filter((t) => t.id !== id);
    setItems(updated);
    saveMutation.mutate(updated);
  };

  const toggleVisible = (id: string) => {
    const updated = items.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t));
    setItems(updated);
    saveMutation.mutate(updated);
  };

  const fetchGoogleReviews = async () => {
    setFetchingGoogle(true);
    try {
      // Call backend endpoint to fetch Google reviews
      const response = await api.get("/google-reviews");
      const googleReviews = response.reviews || [];

      // Add new Google reviews that don't already exist
      const existingGoogleIds = items
        .filter((t) => t.source === "google")
        .map((t) => t.google_review_id);

      const newReviews = googleReviews
        .filter((review: any) => !existingGoogleIds.includes(review.id))
        .map((review: any) => ({
          id: crypto.randomUUID(),
          name: review.author_name,
          role: "Google Review",
          text: review.text,
          rating: review.rating,
          visible: false, // Admin must approve
          source: "google" as const,
          google_review_id: review.id,
        }));

      if (newReviews.length > 0) {
        const updated = [...items, ...newReviews];
        setItems(updated);
        saveMutation.mutate(updated);
        toast.success(`Fetched ${newReviews.length} new Google reviews`);
      } else {
        toast.info("No new reviews found");
      }
    } catch (err: any) {
      if (err.message?.includes("not configured")) {
        setShowGoogleSetup(true);
        toast.error("Google API not configured");
      } else {
        toast.error("Failed to fetch Google reviews");
      }
    }
    setFetchingGoogle(false);
  };

  const manualReviews = items.filter((t) => t.source === "manual");
  const googleReviews = items.filter((t) => t.source === "google");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer reviews from manual entries and Google
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchGoogleReviews}
            disabled={fetchingGoogle}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl text-xs font-semibold hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetchingGoogle ? "animate-spin" : ""}`} />
            {fetchingGoogle ? "Fetching..." : "Fetch Google Reviews"}
          </button>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Manual
          </button>
        </div>
      </div>

      {/* Google API Setup Notice */}
      {showGoogleSetup && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Google Reviews API Setup Required
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                To automatically fetch Google reviews, you need to configure the Google Places API.
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Get a Google Places API key from Google Cloud Console</li>
                <li>Add your Place ID (find it at google.com/business)</li>
                <li>Configure in Admin → Settings → Integrations</li>
              </ol>
            </div>
            <button
              onClick={() => setShowGoogleSetup(false)}
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Testimonials */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          Manual Testimonials
          <span className="text-xs font-normal text-muted-foreground">({manualReviews.length})</span>
        </h2>
        {manualReviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No manual testimonials yet.</p>
        )}
        {manualReviews.map((t) => (
          <div
            key={t.id}
            className={`bg-card border rounded-xl p-4 ${
              t.visible ? "border-border" : "border-border/40 opacity-60"
            }`}
          >
            {editingId === t.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Customer Name *"
                    className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none"
                  />
                  <input
                    value={editForm.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="Role / Title"
                    className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none"
                  />
                </div>
                <textarea
                  value={editForm.text}
                  onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))}
                  placeholder="Review text *"
                  rows={3}
                  className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rating:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setEditForm((f) => ({ ...f, rating: n }))}>
                      <Star
                        className={`w-4 h-4 ${
                          n <= editForm.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmEdit}
                    className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-xs"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">· {t.role}</p>}
                    <div className="flex ml-auto">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3 h-3 ${
                            n <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.text}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleVisible(t.id)}
                    className={`p-1.5 rounded-lg ${
                      t.visible ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Google Reviews */}
      {googleReviews.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Google Reviews
            <span className="text-xs font-normal text-muted-foreground">
              ({googleReviews.filter((r) => r.visible).length} visible / {googleReviews.length} total)
            </span>
          </h2>
          {googleReviews.map((t) => (
            <div
              key={t.id}
              className={`bg-card border rounded-xl p-4 ${
                t.visible ? "border-primary/20 bg-primary/5" : "border-border/40 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                      Google
                    </span>
                    <div className="flex ml-auto">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3 h-3 ${
                            n <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.text}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleVisible(t.id)}
                    className={`p-1.5 rounded-lg ${
                      t.visible ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
