import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Mail, Laptop, Printer, Cpu, Camera } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { FeatureBanner } from "@/components/FeatureBanner";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { products, categories, testimonials, services } from "@/lib/data";
import heroImg from "@/assets/hero-pc.png";

const iconMap: Record<string, any> = { laptop: Laptop, printer: Printer, cpu: Cpu, camera: Camera };
const bestSellers = products.filter((p) => p.badge).slice(0, 4);
const carouselProducts = products.filter((p) => p.badge).slice(0, 6);
const showcaseProducts = products.filter((p) => p.badge && p.originalPrice).slice(0, 5);

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="z-10 text-center space-y-6 px-6"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tighter text-foreground leading-[1.05]">
            Power Your <br /> Digital World.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Precision-engineered hardware & expert services for those who build the future.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/category/macbook" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
              Shop Now
            </Link>
            <Link to="/services" className="px-8 py-4 text-primary rounded-full font-medium hover:underline underline-offset-4">
              Our Services →
            </Link>
          </div>
        </motion.div>
        <motion.img
          src={heroImg}
          alt="Premium PC Setup"
          className="w-full max-w-5xl mt-12 object-contain px-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        />
      </section>

      {/* Feature Banner */}
      <FeatureBanner />

      {/* Product Carousel */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-center mb-12">Handpicked products for every need.</p>
          </AnimatedSection>
          <ProductCarousel products={carouselProducts} />
        </div>
      </section>

      {/* Hero Product Showcase - Large prominent display */}
      <HeroProductShowcase products={showcaseProducts} />

      {/* Categories - Auto Carousel */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Find exactly what you need from our curated collections.</p>
          </AnimatedSection>
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-4">Best Sellers</h2>
            <p className="text-muted-foreground text-center mb-12">Our most loved products, chosen by professionals.</p>
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
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-4">Our Services</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Expert repair and installation by certified technicians.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Cpu;
              return (
                <AnimatedSection key={service.id} delay={i * 0.1}>
                  <Link to="/services" className="group block">
                    <div className="bg-surface rounded-3xl overflow-hidden shadow-ambient hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                      <div className="h-40 overflow-hidden">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="p-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 -mt-10 relative z-10 shadow-ambient">
                          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">{service.name}</h3>
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

      {/* Promo Banner */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-medium tracking-widest uppercase opacity-40 mb-4">Limited Time</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">0% Financing Available</h2>
            <p className="text-lg opacity-60 max-w-xl mx-auto mb-8">Get the hardware you need today. Pay over 12 months with zero interest.</p>
            <Link to="/category/macbook" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
              Shop Now
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-12">What Our Customers Say</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-background rounded-3xl p-8 shadow-ambient">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-prose text-[15px] leading-relaxed mb-6">"{t.text}"</p>
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

      {/* Newsletter */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-xl mx-auto text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-3">Stay Updated</h2>
              <p className="text-muted-foreground mb-8">Get notified about new products and exclusive offers.</p>
              <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 bg-surface rounded-full text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity">Subscribe</button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
