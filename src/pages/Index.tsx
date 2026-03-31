import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, Mail, Laptop, Printer, Cpu, Camera, Monitor, Keyboard, Wrench,
  Truck, Shield, CreditCard, MapPin, Headphones, HardDrive
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import { PremiumHeroBanner } from "@/components/PremiumHeroBanner";
import { ContactSection } from "@/components/ContactSection";
import { products, categories, testimonials, services } from "@/lib/data";

import bannerAccessories from "@/assets/banner-accessories.jpg";
import bannerEmi from "@/assets/banner-emi.jpg";
import bannerBusiness from "@/assets/banner-business.jpg";
import bannerServices from "@/assets/banner-services.jpg";

const bestSellers = products.filter((p) => p.badge).slice(0, 8);
const featuredProducts = products.filter((p) => p.badge).slice(0, 4);

const serviceCards = [
  { icon: Laptop, label: "Laptops", link: "/category/dell-laptop", color: "bg-blue-50 text-blue-600" },
  { icon: Monitor, label: "Desktops", link: "/category/cpu-desktop", color: "bg-green-50 text-green-600" },
  { icon: Printer, label: "Printers", link: "/category/printers", color: "bg-purple-50 text-purple-600" },
  { icon: Keyboard, label: "Accessories", link: "/category/keyboards", color: "bg-orange-50 text-orange-600" },
  { icon: Wrench, label: "Repair Services", link: "/services", color: "bg-red-50 text-red-600" },
  { icon: Headphones, label: "Peripherals", link: "/category/keyboards", color: "bg-pink-50 text-pink-600" },
  { icon: HardDrive, label: "Components", link: "/category/cpu-desktop", color: "bg-indigo-50 text-indigo-600" },
  { icon: Camera, label: "CCTV & Security", link: "/services", color: "bg-teal-50 text-teal-600" },
];

const trustBadges = [
  { icon: Truck, label: "Free Delivery", desc: "Across Jaipur" },
  { icon: Shield, label: "1 Year Warranty", desc: "On all products" },
  { icon: CreditCard, label: "0% EMI", desc: "Easy installments" },
  { icon: MapPin, label: "Visit Store", desc: "Malviya Nagar, Jaipur" },
];

export default function Index() {
  return (
    <div className="bg-background">
      {/* Hero Banner Carousel */}
      <PremiumHeroBanner />

      {/* Our Services — Cashify-style icon grid */}
      <section className="py-10 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Our Services</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {serviceCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={s.link}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center">{s.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category — Cashify style rounded cards */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wide Promo Banner */}
      <section className="py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <Link to="/category/keyboards" className="block rounded-xl overflow-hidden relative group">
            <img src={bannerAccessories} alt="Accessories Sale" className="w-full h-[140px] sm:h-[180px] object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8">
              <div>
                <h3 className="text-white text-lg sm:text-2xl font-bold">Accessories Sale — Up to 30% Off</h3>
                <p className="text-white/80 text-sm mt-1">Keyboards, Mice, Headsets & More</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Featured Products</h2>
            <Link to="/category/dell-laptop" className="text-primary text-sm font-medium hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges — Cashify "Why us" style */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Banner */}
      <section className="py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <Link to="/contact" className="block rounded-xl overflow-hidden relative group">
            <img src={bannerEmi} alt="EMI Available" className="w-full h-[140px] sm:h-[180px] object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8">
              <div>
                <h3 className="text-white text-lg sm:text-2xl font-bold">0% EMI on All Laptops</h3>
                <p className="text-white/80 text-sm mt-1">Easy financing — pay in monthly installments</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Best Sellers</h2>
            <Link to="/category/hp-laptop" className="text-primary text-sm font-medium hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Banner */}
      <section className="py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <Link to="/services" className="block rounded-xl overflow-hidden relative group">
            <img src={bannerServices} alt="Repair Services" className="w-full h-[140px] sm:h-[180px] object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8">
              <div>
                <h3 className="text-white text-lg sm:text-2xl font-bold">Expert Repair & IT Services</h3>
                <p className="text-white/80 text-sm mt-1">Certified technicians for all brands</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Our Repair Services */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Repair & IT Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.05}>
                <Link to="/services" className="group block">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="h-36 overflow-hidden">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-1">{service.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Business Banner */}
      <section className="py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <Link to="/contact" className="block rounded-xl overflow-hidden relative group">
            <img src={bannerBusiness} alt="Business Solutions" className="w-full h-[140px] sm:h-[180px] object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8">
              <div>
                <h3 className="text-white text-lg sm:text-2xl font-bold">Enterprise IT Solutions</h3>
                <p className="text-white/80 text-sm mt-1">Bulk orders & custom setups for business</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
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
      <section className="py-10 bg-muted/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Stay Updated</h2>
            <p className="text-sm text-muted-foreground mb-6">Get notified about new products and exclusive offers.</p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2.5 bg-card rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
