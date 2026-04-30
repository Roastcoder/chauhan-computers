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
        <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-20">
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
        keywords={`tech news, ${blog.title}, Chauhan Computers`}
      />
      
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:py-16">
        <div className="max-w-[800px] mx-auto">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{blog.author}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Author</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-foreground">{new Date(blog.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Published</p>
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
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-16 -mx-2 md:-mx-4 lg:-mx-8"
        >
          <img 
            src={blog.featured_image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200"} 
            alt={blog.title}
            className="w-full aspect-[21/9] object-cover rounded-[2rem] shadow-2xl border border-border"
          />
        </motion.div>

        <div className="max-w-[800px] mx-auto">
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl prose-p:leading-relaxed prose-p:text-slate-600">
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
          </article>

          <footer className="mt-20 pt-10 border-t border-border">
            <div className="p-8 md:p-12 bg-slate-900 rounded-[2.5rem] text-center text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-blue-500/20 opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Need a Tech Solution?</h3>
                <p className="text-white/70 mb-8 max-w-md mx-auto text-base">
                  From laptop repairs to professional IT consulting, our experts at Chauhan Computers are here to help.
                </p>
                <Link to="/contact" className="inline-block bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl hover:shadow-white/10">
                  Get in Touch
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
