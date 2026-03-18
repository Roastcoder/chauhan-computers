import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import { products, testimonials } from "@/lib/data";
import heroImg from "@/assets/hero-pc.png";
import laptopImg from "@/assets/laptop.png";
import desktopImg from "@/assets/desktop.png";
import gamingImg from "@/assets/gaming.png";
import accessoriesImg from "@/assets/accessories.png";

const categoryData = [
  { name: "Laptops", slug: "laptops", image: laptopImg },
  { name: "Desktops", slug: "desktops", image: desktopImg },
  { name: "Gaming", slug: "gaming", image: gamingImg },
  { name: "Accessories", slug: "accessories", image: accessoriesImg },
];

const bestSellers = products.slice(0, 4);

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
            Precision-engineered hardware for those who build the future.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              to="/category/laptops"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
            <Link
              to="/category/desktops"
              className="px-8 py-4 text-primary rounded-full font-medium hover:underline underline-offset-4"
            >
              Learn more →
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

      {/* Categories */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
              Find exactly what you need from our curated collections.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categoryData.map((cat, i) => (
              <AnimatedSection key={cat.slug} delay={i * 0.1}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="group bg-background rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-ambient hover:shadow-elevated transition-shadow duration-500"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  <h3 className="text-base font-semibold text-foreground">{cat.name}</h3>
                  <span className="text-sm text-primary mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-4">
              Best Sellers
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Our most loved products, chosen by professionals.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-medium tracking-widest uppercase opacity-40 mb-4">Limited Time</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
              0% Financing Available
            </h2>
            <p className="text-lg opacity-60 max-w-xl mx-auto mb-8">
              Get the hardware you need today. Pay over 12 months with zero interest.
            </p>
            <Link
              to="/category/laptops"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-12">
              What Our Customers Say
            </h2>
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
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-8">
                Get notified about new products and exclusive offers.
              </p>
              <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 bg-surface rounded-full text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
