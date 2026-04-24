import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Edit2, Check, X } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400",
  telecaller: "bg-cyan-500/20 text-cyan-400",
  customer: "bg-green-500/20 text-green-400",
};

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/users"),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      api.put(`/users/${id}`, { is_active: !is_active }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User updated"); },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.put(`/users/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role updated");
      setEditingRole(null);
    },
  });

  const startEditRole = (userId: string, currentRole: string) => {
    setEditingRole(userId);
    setNewRole(currentRole);
  };

  const confirmRoleChange = (userId: string) => {
    if (newRole) {
      updateRole.mutate({ id: userId, role: newRole });
    }
  };

  const filtered = (users as any[]).filter((u: any) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.full_name?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Users</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="telecaller">Telecaller</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No users found</td></tr>}
              {filtered.map((u: any) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{u.full_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {editingRole === u.id ? (
                      <div className="flex items-center gap-2">
                        <select value={newRole} onChange={e => setNewRole(e.target.value)} className="px-2 py-1 bg-background rounded-lg text-xs border border-border outline-none">
                          <option value="admin">Admin</option>
                          <option value="telecaller">Telecaller</option>
                          <option value="customer">Customer</option>
                        </select>
                        <button onClick={() => confirmRoleChange(u.id)} className="p-1 rounded-lg text-green-500 hover:bg-green-500/10">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingRole(null)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[u.role] || "bg-muted text-muted-foreground"}`}>{u.role}</span>
                        <button onClick={() => startEditRole(u.id, u.role)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive.mutate({ id: u.id, is_active: u.is_active })} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${u.is_active ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400" : "bg-red-500/20 text-red-400 hover:bg-green-500/20 hover:text-green-400"}`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
