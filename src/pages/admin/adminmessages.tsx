import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen, Download } from "lucide-react";

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"messages" | "newsletter">("messages");

  const { data: messages = [] } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => api.get("/contact-messages"),
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ["newsletter"],
    queryFn: () => api.get("/newsletter"),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.put(`/contact-messages/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact-messages"] }),
  });

  const deleteMsg = useMutation({
    mutationFn: (id: string) => api.delete(`/contact-messages/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["contact-messages"] }); toast.success("Deleted"); },
  });

  const deleteSub = useMutation({
    mutationFn: (id: string) => api.delete(`/newsletter/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["newsletter"] }); toast.success("Removed"); },
  });

  const exportSubscribers = () => {
    const csv = "Email,Date\n" + (subscribers as any[]).map((s: any) => `${s.email},${s.created_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "subscribers.csv"; a.click();
  };

  const unread = (messages as any[]).filter((m: any) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Messages & Subscribers</h1>

      <div className="flex gap-2">
        <button onClick={() => setTab("messages")} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === "messages" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          Contact Messages {unread > 0 && <span className="ml-1.5 bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded-full">{unread}</span>}
        </button>
        <button onClick={() => setTab("newsletter")} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === "newsletter" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          Newsletter ({(subscribers as any[]).length})
        </button>
      </div>

      {tab === "messages" && (
        <div className="space-y-3">
          {(messages as any[]).length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
          {(messages as any[]).map((msg: any) => (
            <div key={msg.id} className={`bg-card border rounded-xl p-4 ${!msg.is_read ? "border-primary/30" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    <p className="text-sm font-semibold text-foreground">{msg.name}</p>
                    {msg.email && <p className="text-xs text-muted-foreground">{msg.email}</p>}
                    <p className="text-[10px] text-muted-foreground ml-auto">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  {msg.subject && <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>}
                  <p className="text-xs text-muted-foreground">{msg.message}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!msg.is_read && (
                    <button onClick={() => markRead.mutate(msg.id)} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted" title="Mark as read">
                      <MailOpen className="w-4 h-4" />
                    </button>
                  )}
                  {msg.email && (
                    <a href={`mailto:${msg.email}`} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted" title="Reply">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => deleteMsg.mutate(msg.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "newsletter" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={exportSubscribers} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {(subscribers as any[]).length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No subscribers yet.</td></tr>}
                {(subscribers as any[]).map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="px-4 py-3 text-foreground">{s.email}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.is_active ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>{s.is_active ? "Active" : "Inactive"}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteSub.mutate(s.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
