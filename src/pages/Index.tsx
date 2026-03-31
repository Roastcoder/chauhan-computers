import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Mail, Laptop, Printer, Cpu, Camera } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { FeatureBanner } from "@/components/FeatureBanner";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { PremiumHeroBanner } from "@/components/PremiumHeroBanner";
import { DealsSection } from "@/components/DealsSection";
import { ContactSection } from "@/components/ContactSection";
import { products, categories, testimonials, services } from "@/lib/data";

const iconMap: Record<string, any> = { laptop: Laptop, printer: Printer, cpu: Cpu, camera: Camera };
const bestSellers = products.filter((p) => p.badge).slice(0, 4);
const carouselProducts = products.filter((p) => p.badge).slice(0, 6);
const showcaseProducts = products.filter((p) => p.badge && p.originalPrice).slice(0, 5);

export default function Index() {
  return (
    <div>
      <PremiumHeroBanner />
      <FeatureBanner />

      {/* Featured Products Carousel */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-center mb-12">Handpicked products for every need.</p>
          </AnimatedSection>
          <ProductCarousel products={carouselProducts} />
        </div>
      </section>

      <HeroProductShowcase products={showcaseProducts} />

      {/* Categories */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Find exactly what you need.</p>
          </AnimatedSection>
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* Hot Deals */}
      <DealsSection />

      {/* Best Sellers */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-4">Best Sellers</h2>
            <p className="text-muted-foreground text-center mb-12">Our most loved products.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-4">Our Services</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Expert repair and installation by certified technicians.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Cpu;
              return (
                <AnimatedSection key={service.id} delay={i * 0.1}>
                  <Link to="/services" className="group block">
                    <div className="glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:glow-primary hover:-translate-y-1">
                      <div className="h-40 overflow-hidden">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="p-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 -mt-10 relative z-10">
                          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">{service.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="py-24 gradient-mesh">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">Limited Time</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">0% Financing Available</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">Get the hardware you need today. Pay over 12 months with zero interest.</p>
            <Link to="/category/macbook" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity glow-primary">
              Shop Now
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-12">What Our Customers Say</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-prose text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />

      {/* Newsletter */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-xl mx-auto text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Stay Updated</h2>
              <p className="text-muted-foreground mb-8">Get notified about new products and exclusive offers.</p>
              <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 bg-surface rounded-full text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-foreground/[0.05]" />
                <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">Subscribe</button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
