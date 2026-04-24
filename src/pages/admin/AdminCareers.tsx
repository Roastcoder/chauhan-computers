import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Eye, EyeOff, GripVertical } from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  visible: boolean;
}

const defaultOpenings = [
  { title: "Sales Executive", location: "In-Store", type: "Full-time", description: "Help customers find the perfect tech solutions. Must have excellent communication skills." },
  { title: "Hardware Technician", location: "Service Center", type: "Full-time", description: "Diagnose and repair laptops, desktops, and printers. 2+ years experience required." },
  { title: "CCTV Installation Engineer", location: "Field", type: "Full-time", description: "Install and configure CCTV systems for residential and commercial clients." },
  { title: "Digital Marketing Specialist", location: "Remote", type: "Part-time", description: "Manage our online presence, social media, and advertising campaigns." },
];

const empty = (): JobOpening => ({
  id: crypto.randomUUID(),
  title: "",
  location: "",
  type: "Full-time",
  description: "",
  visible: true,
});

export default function AdminCareers() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const saved: JobOpening[] = (settings as any[]).find((s: any) => s.key === "careers_config")?.value || [];

  const [items, setItems] = useState<JobOpening[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<JobOpening>(empty());

  useEffect(() => {
    if (saved.length > 0) {
      setItems(saved);
    } else if (defaultOpenings.length > 0) {
      // Pre-populate with default job openings from website
      const initialJobs = defaultOpenings.map((job, idx) => ({
        id: `job-${idx}`,
        title: job.title,
        location: job.location,
        type: job.type,
        description: job.description,
        visible: true
      }));
      setItems(initialJobs);
    }
  }, [(settings as any[]).length]);

  const saveMutation = useMutation({
    mutationFn: (list: JobOpening[]) => api.put("/settings/careers_config", { value: list }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Careers saved");
    },
  });

  const startEdit = (job: JobOpening) => {
    setEditingId(job.id);
    setEditForm({ ...job });
  };

  const startAdd = () => {
    const n = empty();
    setItems((prev) => [...prev, n]);
    setEditingId(n.id);
    setEditForm(n);
  };

  const confirmEdit = () => {
    if (!editForm.title || !editForm.description) {
      toast.error("Title and description required");
      return;
    }
    const updated = items.map((item) => (item.id === editingId ? editForm : item));
    setItems(updated);
    setEditingId(null);
    saveMutation.mutate(updated);
  };

  const cancelEdit = () => {
    if (!items.find((s) => s.id === editingId)?.title) {
      setItems((prev) => prev.filter((s) => s.id !== editingId));
    }
    setEditingId(null);
  };

  const deleteJob = (id: string) => {
    if (!confirm("Delete this job opening?")) return;
    const updated = items.filter((s) => s.id !== id);
    setItems(updated);
    saveMutation.mutate(updated);
  };

  const toggleVisible = (id: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item));
    setItems(updated);
    saveMutation.mutate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Careers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage job openings and career opportunities</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Job Opening
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No job openings yet. Click "Add Job Opening" to create one.</p>
          </div>
        )}

        {items.map((job) => (
          <div
            key={job.id}
            className={`bg-card border border-border rounded-xl p-4 ${!job.visible ? "opacity-60" : ""}`}
          >
            {editingId === job.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Job Title"
                    className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Location (e.g., In-Store, Remote)"
                    className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Job description and requirements"
                  rows={3}
                  className="w-full px-3 py-2 bg-background rounded-lg text-sm border border-border outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={confirmEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-muted/80 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{job.location}</span>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleVisible(job.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          job.visible
                            ? "text-primary hover:bg-primary/10"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {job.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(job)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
