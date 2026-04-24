import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  page: string;
  position: number;
  is_active: boolean;
  banner_type: string;
}

export function useBanners(page: string, type?: string) {
  return useQuery({
    queryKey: ["banners", page, type],
    queryFn: async () => {
      const params = new URLSearchParams({ page });
      if (type) params.set("type", type);
      return (await api.get(`/banners?${params}`)) as Banner[];
    },
    staleTime: 60_000,
  });
}
