import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Store, Search, Megaphone, Layout } from "lucide-react";

export default function AdminWebsite() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["crm-settings"],
    queryFn: () => api.get("/settings"),
  });

  const get = (key: string, fallback: any = {}) =>
    (settings as any[]).find((s: any) => s.key === key)?.value ?? fallback;

  const storeInfo = get("store_info");
  const seoConfig = get("seo_config", { title: "", description: "", keywords: "" });
  const heroConfig = get("hero_config", { headline: "", subheadline: "", cta_text: "", cta_link: "" });
  const announcementConfig = get("announcement_config", { text: "", visible: false, link: "" });

  const [store, setStore] = useState({ name: "", address: "", phone: "", phone2: "", phone3: "", email: "", hours: "", whatsapp: "", map_embed: "", about_text: "" });
  const [seo, setSeo] = useState({ title: "", description: "", keywords: "" });
  const [hero, setHero] = useState({ headline: "", subheadline: "", cta_text: "", cta_link: "" });
  const [announcement, setAnnouncement] = useState({ text: "", visible: false, link: "" });

  useEffect(() => {
    if (Object.keys(storeInfo).length > 0) setStore(f => ({ ...f, ...storeInfo }));
  }, [(settings as any[]).length]);

  useEffect(() => { setSeo(f => ({ ...f, ...seoConfig })); }, [(settings as any[]).length]);
  useEffect(() => { setHero(f => ({ ...f, ...heroConfig })); }, [(settings as any[]).length]);
  useEffect(() => { setAnnouncement(f => ({ ...f, ...announcementConfig })); }, [(settings as any[]).length]);

  const saving = (key: string, value: any) =>
    api.put(`/settings/${key}`, { value }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["crm-settings"] });
      toast.success("Saved");
    });

  const storeM = useMutation({ mutationFn: () => saving("store_info", store) });
  const seoM = useMutation({ mutationFn: () => saving("seo_config", seo) });
  const heroM = useMutation({ mutationFn: () => saving("hero_config", hero) });
  const announcementM = useMutation({ mutationFn: () => saving("announcement_config", announcement) });

  const inp = "w-full px-4 py-2.5 bg-background rounded-xl text-sm text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Website Content</h1>

      {/* Announcement Bar */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Megaphone className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Announcement Bar</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Show announcement bar</p>
              <p className="text-xs text-muted-foreground">Displays a top banner across all pages</p>
            </div>
            <button onClick={() => setAnnouncement(f => ({ ...f, visible: !f.visible }))} className={`w-12 h-6 rounded-full transition-colors shrink-0 ${announcement.visible ? "bg-primary" : "bg-muted"}`}>
              <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${announcement.visible ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          <input value={announcement.text} onChange={e => setAnnouncement(f => ({ ...f, text: e.target.value }))} placeholder="e.g. 🎉 Summer Sale — Up to 30% off on all laptops!" className={inp} />
          <input value={announcement.link} onChange={e => setAnnouncement(f => ({ ...f, link: e.target.value }))} placeholder="Link (optional, e.g. /category/dell-laptop)" className={inp} />
        </div>
        <button onClick={() => announcementM.mutate()} disabled={announcementM.isPending} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
          {announcementM.isPending ? "Saving..." : "Save Announcement"}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layout className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Hero Section Text</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={hero.headline} onChange={e => setHero(f => ({ ...f, headline: e.target.value }))} placeholder="Main headline" className={inp} />
          <input value={hero.subheadline} onChange={e => setHero(f => ({ ...f, subheadline: e.target.value }))} placeholder="Sub-headline" className={inp} />
          <input value={hero.cta_text} onChange={e => setHero(f => ({ ...f, cta_text: e.target.value }))} placeholder="CTA Button Text (e.g. Shop Now)" className={inp} />
          <input value={hero.cta_link} onChange={e => setHero(f => ({ ...f, cta_link: e.target.value }))} placeholder="CTA Link (e.g. /category/dell-laptop)" className={inp} />
        </div>
        <button onClick={() => heroM.mutate()} disabled={heroM.isPending} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
          {heroM.isPending ? "Saving..." : "Save Hero"}
        </button>
      </div>

      {/* SEO */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Search className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">SEO Settings</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Page Title</label>
            <input value={seo.title} onChange={e => setSeo(f => ({ ...f, title: e.target.value }))} placeholder="Chauhan Computers — Jaipur's Best Computer Store" className={inp} />
            <p className="text-[10px] text-muted-foreground mt-1">{seo.title.length}/60 characters</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Meta Description</label>
            <textarea value={seo.description} onChange={e => setSeo(f => ({ ...f, description: e.target.value }))} placeholder="Buy laptops, desktops, printers and accessories in Jaipur..." rows={3} className={`${inp} resize-none`} />
            <p className="text-[10px] text-muted-foreground mt-1">{seo.description.length}/160 characters</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Keywords (comma separated)</label>
            <input value={seo.keywords} onChange={e => setSeo(f => ({ ...f, keywords: e.target.value }))} placeholder="laptop jaipur, computer store jaipur, dell laptop jaipur" className={inp} />
          </div>
        </div>
        <button onClick={() => seoM.mutate()} disabled={seoM.isPending} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
          {seoM.isPending ? "Saving..." : "Save SEO"}
        </button>
      </div>

      {/* Store Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Store className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Store Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={store.name} onChange={e => setStore(f => ({ ...f, name: e.target.value }))} placeholder="Store Name" className={inp} />
          <input value={store.email} onChange={e => setStore(f => ({ ...f, email: e.target.value }))} placeholder="Email" className={inp} />
          <input value={store.phone} onChange={e => setStore(f => ({ ...f, phone: e.target.value }))} placeholder="Primary Phone" className={inp} />
          <input value={store.phone2} onChange={e => setStore(f => ({ ...f, phone2: e.target.value }))} placeholder="Phone 2" className={inp} />
          <input value={store.phone3} onChange={e => setStore(f => ({ ...f, phone3: e.target.value }))} placeholder="Phone 3 (Service)" className={inp} />
          <input value={store.whatsapp} onChange={e => setStore(f => ({ ...f, whatsapp: e.target.value }))} placeholder="WhatsApp Number (e.g. 919509317543)" className={inp} />
          <input value={store.hours} onChange={e => setStore(f => ({ ...f, hours: e.target.value }))} placeholder="Business Hours" className={inp} />
        </div>
        <div className="mt-4 space-y-3">
          <textarea value={store.address} onChange={e => setStore(f => ({ ...f, address: e.target.value }))} rows={2} placeholder="Address" className={`${inp} resize-none`} />
          <textarea value={store.about_text} onChange={e => setStore(f => ({ ...f, about_text: e.target.value }))} rows={4} placeholder="About Us text..." className={`${inp} resize-none`} />
          <input value={store.map_embed} onChange={e => setStore(f => ({ ...f, map_embed: e.target.value }))} placeholder="Google Maps Embed URL" className={inp} />
          {store.map_embed && (
            <div className="rounded-xl overflow-hidden h-40">
              <iframe src={store.map_embed} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map Preview" />
            </div>
          )}
        </div>
        <button onClick={() => storeM.mutate()} disabled={storeM.isPending} className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50">
          {storeM.isPending ? "Saving..." : "Save Store Info"}
        </button>
      </div>
    </div>
  );
}
