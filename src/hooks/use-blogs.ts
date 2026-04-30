import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      return (await api.get("/blogs")) as Blog[];
    },
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      return (await api.get(`/blogs/${slug}`)) as Blog;
    },
    enabled: !!slug,
  });
}

export function useAdminBlogs() {
  return useQuery({
    queryKey: ["blogs", "admin"],
    queryFn: async () => {
      return (await api.get("/blogs/admin/all")) as Blog[];
    },
  });
}
