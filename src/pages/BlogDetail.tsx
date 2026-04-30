import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ChevronLeft, Share2, Tag } from "lucide-react";
import { useBlog } from "@/hooks/use-blogs";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading } = useBlog(slug || "");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
          <Skeleton className="h-10 w-3/4 mb-8" />
          <Skeleton className="aspect-video w-full rounded-3xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEO 
        title={blog.title} 
        description={blog.excerpt} 
        keywords={`${blog.category}, tech news, ${blog.title}`}
      />
      
      <div className="max-w-[900px] mx-auto px-6 py-12 md:py-24">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-12 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pb-12 border-b border-border">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{blog.author}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Author</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-foreground">{new Date(blog.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Published</p>
              </div>
            </div>
            
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <img 
            src={blog.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200"} 
            alt={blog.title}
            className="w-full aspect-video object-cover rounded-[2.5rem] shadow-2xl border border-border"
          />
        </motion.div>

        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
        </article>

        <footer className="mt-20 pt-10 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground mr-2" />
            {blog.category.split(',').map((tag) => (
              <span key={tag} className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                #{tag.trim()}
              </span>
            ))}
          </div>
          
          <div className="mt-12 p-8 md:p-12 bg-slate-900 rounded-[2rem] text-center text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 opacity-50" />
            <h3 className="text-2xl font-bold mb-4 relative">Need a Tech Solution?</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto relative text-sm">
              From laptop repairs to professional IT consulting, our experts at Chauhan Computers are here to help.
            </p>
            <Link to="/contact" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform relative">
              Get in Touch
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
