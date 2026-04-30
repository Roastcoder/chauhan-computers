import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ChevronRight } from "lucide-react";
import { useBlogs } from "@/hooks/use-blogs";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Blog() {
  const { data: blogs = [], isLoading } = useBlogs();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Tech Blog" 
        description="Latest news, reviews and tips on laptops, computers and IT services from Chauhan Computers."
        keywords="laptop blog, tech news, computer repair tips, Chauhan Computers blog"
      />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20">
        <header className="mb-12 md:mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Insights & Innovation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Stay updated with the latest trends in tech, laptop maintenance tips, and our expert service updates.
          </motion.p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <AnimatedSection key={blog.id} delay={idx * 0.1}>
                <Link to={`/blog/${blog.slug}`} className="group block h-full">
                  <article className="bg-card rounded-3xl border border-border overflow-hidden flex flex-col h-full hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={blog.featured_image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{blog.author}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-2 text-primary text-sm font-bold mt-auto group-hover:gap-3 transition-all">
                        Read Story <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
