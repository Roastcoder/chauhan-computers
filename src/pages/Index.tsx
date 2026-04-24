import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/supabase/client";
import {
  Star, Mail, MapPin, Award, Users, Heart, ChevronRight
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import { PremiumHeroBanner } from "@/components/PremiumHeroBanner";
import { ContactSection } from "@/components/ContactSection";
import { InfiniteServiceCarousel } from "@/components/InfiniteServiceCarousel";
import { useBanners } from "@/hooks/use-banners";
import { useProducts } from "@/hooks/use-products";
import { categories, services as fallbackServices } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

import bannerServices from "@/assets/banner-services.jpg";
import warrantyBadge from "@/assets/warranty-banner-final.png";

import serviceLaptops from "@/assets/service-laptops.jpg";
import serviceDesktops from "@/assets/service-desktops.jpg";
import servicePrinters from "@/assets/service-printers.jpg";
import serviceAccessories from "@/assets/service-accessories.jpg";
import serviceRepair from "@/assets/service-repair.jpg";

const serviceCards = [
  { image: serviceLaptops, label: "Laptops", link: "/category/dell-laptop" },
  { image: serviceDesktops, label: "Desktops", link: "/category/cpu-desktop" },
  { image: servicePrinters, label: "Printers", link: "/category/printers" },
  { image: serviceAccessories, label: "Accessories", link: "/category/keyboards" },
  { image: serviceRepair, label: "Repair Services", link: "/services" },
];

const trustStats = [
  { icon: Star, value: "4.8★", label: "Google Rating", color: "text-yellow-500", href: "https://www.google.com/search?q=Chauhan+Computers+Jaipur" },
  { icon: Award, value: "4.7★", label: "JustDial Rating", color: "text-primary", href: "https://www.justdial.com/Jaipur/Chauhan-Computers" },
  { icon: Users, value: "10,000+", label: "Customers Served", color: "text-cyan-500", href: null },
  { icon: Heart, value: "Since 2010", label: "Still Serving", color: "text-red-500", href: null },
];

const fallbackPromos = [
  { image: warrantyBadge, title: "30 Days Hardware Warranty", subtitle: "On all products — terms apply", link: "/contact" },
  { image: bannerServices, title: "Expert Repair & IT Services", subtitle: "Certified technicians for all brands", link: "/services" },
];

// Instagram video reels from Chauhan Computers
const customerVideos = [
  { embedUrl: "https://www.instagram.com/reel/DWlIY8jD5ji/embed", caption: "Happy Customer Review" },
  { embedUrl: "https://www.instagram.com/reel/DWMHXMdB8qr/embed", caption: "Premium Laptop Unboxing" },
  { embedUrl: "https://www.instagram.com/reel/DWv6jbmDy2E/embed", caption: "Store Service Showcase" },
  { embedUrl: "https://www.instagram.com/reel/DWOC_klBekI/embed", caption: "Happy Customer Feedback" },
];

function PromoBannerCard({ image, title, subtitle, link }: { image: string; title: string; subtitle: string; link: string }) {
  return (
    <section className="py-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <Link to={link} className="block rounded-xl overflow-hidden relative group aspect-[4/1] md:aspect-[8/1] bg-muted">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center px-6 sm:px-8">
            <div className="max-w-[50%]">
              <h3 className="text-white text-sm sm:text-lg md:text-xl font-bold leading-tight">{title}</h3>
              <p className="text-white/80 text-[10px] sm:text-xs mt-1">{subtitle}</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <Skeleton className="w-full aspect-square rounded-lg mb-3" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("http://localhost:4000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch {}
    setLoading(false);
  };

  if (done) return <p className="text-sm text-green-500 font-medium">Thanks for subscribing! 🎉</p>;

  return (
    <form className="flex gap-2 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-3 sm:px-4 py-2.5 bg-card rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
      <button type="submit" disabled={loading} className="px-4 sm:px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity disabled:opacity-50">{loading ? "..." : "Subscribe"}</button>
    </form>
  );
}

export default function Index() {
  const { data: dbPromos } = useBanners("home", "promo");
  const { data: products = [], isLoading } = useProducts();
  const { data: settings = [] } = useQuery({
    queryKey: ["public-settings"],
    queryFn: () => api.get("/settings/public"),
  });

  const servicesConfig = (settings as any[]).find((s: any) => s.key === "services_config")?.value || [];
  const services = servicesConfig.length > 0 ? servicesConfig.filter((svc: any) => svc.visible) : fallbackServices;

  const promos = dbPromos && dbPromos.length > 0
    ? dbPromos.map(b => ({ image: b.image_url, title: b.title, subtitle: b.subtitle || "", link: b.cta_link }))
    : fallbackPromos;

  const bestSellers = products.filter((p) => p.badge).slice(0, 8);

  return (
    <div className="bg-background">
      <PremiumHeroBanner />

      {/* Trust Stats Bar */}
      <section className="py-4 sm:py-6 bg-muted/30 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {trustStats.map((stat, i) => {
              const inner = (
                <>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                  <div>
                    <p className="text-xs sm:text-base font-bold text-foreground">{stat.value}</p>
                    <p className="text-[9px] sm:text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </>
              );
              return stat.href ? (
                <motion.a key={stat.label} href={stat.href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border text-center justify-center hover:border-primary/30 transition-colors cursor-pointer">
                  {inner}
                </motion.a>
              ) : (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border text-center justify-center">
                  {inner}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-8 sm:py-10 border-b border-border" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2a2200 70%, #1a1500 100%)" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-2xl font-bold text-white mb-5">Shop by Brand</h2>
          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-7 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link to={`/category/${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-yellow-900/40 hover:border-yellow-500/60 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all group h-full">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center mb-1">
                    <img src={cat.image} alt={cat.name} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-white block leading-tight">{cat.name}</span>
                    <span className="text-[11px] text-yellow-400/70 block mt-1 leading-tight">{cat.subtitle}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden relative">
            <style dangerouslySetInnerHTML={{
              __html: `
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
              {categories.map((cat, i) => (
                <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  className="flex-none w-[140px] snap-start">
                  <Link to={`/category/${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-yellow-900/40 hover:border-yellow-500/60 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all group h-full">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center mb-1">
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-white block leading-tight">{cat.name}</span>
                      <span className="text-[9px] text-yellow-400/70 block mt-1 leading-tight">{cat.subtitle}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Best Sellers */}
      <section className="py-8 sm:py-10 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground">Best Sellers</h2>
            <Link to="/category/hp-laptop" className="text-primary text-xs sm:text-sm font-medium hover:underline">View All →</Link>
          </div>
          {isLoading ? <ProductGridSkeleton /> : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {bestSellers.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {promos[0] && <PromoBannerCard {...promos[0]} />}









      {/* Our Services — Lower on Page */}
      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground">Our Services</h2>
            <Link to="/services" className="text-primary text-xs sm:text-sm font-medium hover:underline">View All →</Link>
          </div>
          <InfiniteServiceCarousel cards={serviceCards} />
        </div>
      </section>

      {promos[1] && <PromoBannerCard {...promos[1]} />}


      {/* Repair Services */}
      <section className="py-8 sm:py-10 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-5">Repair & IT Services</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {services.map((service: any, i: number) => (
              <AnimatedSection key={service.id} delay={i * 0.05}>
                <Link to="/services" className="group block">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="h-28 sm:h-36 overflow-hidden">
                      <img src={service.image_url || service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1">{service.name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Video Testimonials */}
      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-5">What Our Customers Say</h2>
          <div className="relative group/reel">
            {/* Custom style for hiding scrollbar */}
            <style dangerouslySetInnerHTML={{
              __html: `
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
            <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 px-1">
              {customerVideos.map((video, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="flex-none w-[280px] sm:w-[320px] snap-start">
                    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-[9/16] bg-muted relative overflow-hidden">
                        <iframe
                          src={`${video.embedUrl}?utm_source=ig_web_copy_link`}
                          className="absolute -top-[55px] left-0 w-full h-[calc(100%+115px)]"
                          frameBorder="0"
                          scrolling="no"
                          title={video.caption}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs sm:text-sm font-medium text-foreground">{video.caption}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Newsletter */}
      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3" />
            <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2">Stay Updated</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-5">Get notified about new products and exclusive offers.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
