import { useState } from "react";
import { useAdminBlogs } from "@/hooks/use-blogs";
import { api } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Edit2, Trash2, Globe, Lock, Loader2, 
  LayoutList, FileText, Image as ImageIcon, User, Tag
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminBlogs() {
  const { data: blogs = [], isLoading, refetch } = useAdminBlogs();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author: "Admin",
    status: "published"
  });

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      featured_image: "",
      author: "Admin",
      status: "published"
    });
    setEditingBlog(null);
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image: blog.featured_image,
      author: blog.author,
      status: blog.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog.id}`, formData);
        toast.success("Blog updated successfully");
      } else {
        await api.post("/blogs", formData);
        toast.success("Blog created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      toast.error("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage your technical articles and news.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/10">
              <Plus className="w-4 h-4 mr-2" /> New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
                <div className="relative">
                  <LayoutList className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required 
                    placeholder="Enter blog title..." 
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Status</label>
                  <select 
                    className="w-full h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all px-4 text-sm"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Author</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Admin Name" 
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Featured Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://..." 
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.featured_image}
                    onChange={e => setFormData({...formData, featured_image: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Short Excerpt</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea 
                    placeholder="Brief summary for list view..." 
                    className="pl-10 min-h-[80px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Content (HTML allowed)</label>
                <Textarea 
                  required 
                  placeholder="Full blog content..." 
                  className="min-h-[250px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full h-12 rounded-xl text-md font-bold shadow-xl shadow-primary/20">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : editingBlog ? "Update Post" : "Create Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 border-none shadow-sm bg-slate-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title..." 
            className="pl-10 h-12 rounded-xl border-none bg-white shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-2xl" />)
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <LayoutList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No blog posts found.</p>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <div key={blog.id} className="group bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                <img 
                  src={blog.featured_image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=200"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={blog.status === 'published' ? "default" : "secondary"} className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                    {blog.status === 'published' ? <><Globe className="w-3 h-3 mr-1" /> Public</> : <><Lock className="w-3 h-3 mr-1" /> Draft</>}
                  </Badge>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{blog.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                <Button variant="outline" size="icon" onClick={() => handleEdit(blog)} className="w-10 h-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(blog.id)} className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
