import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cashifyHero1 from "@/assets/cashify-hero-1.jpg";
import cashifyHero2 from "@/assets/cashify-hero-2.jpg";
import cashifyHero3 from "@/assets/cashify-hero-3.jpg";

const slides = [
  {
    image: cashifyHero1,
    title: "Best Deals on Laptops & Desktops",
    subtitle: "Up to 40% off on top brands — Dell, HP, Lenovo & more",
    cta: "Shop Now",
    ctaLink: "/category/dell-laptop",
    bg: "from-emerald-400 to-teal-500",
  },
  {
    image: cashifyHero2,
    title: "Gaming Laptops & Accessories",
    subtitle: "High-performance setups for every gamer",
    cta: "Explore Gaming",
    ctaLink: "/category/keyboards",
    bg: "from-orange-400 to-red-500",
  },
  {
    image: cashifyHero3,
    title: "Premium Apple Products",
    subtitle: "MacBook, iMac & more at unbeatable prices",
    cta: "Shop Apple",
    ctaLink: "/category/macbook",
    bg: "from-blue-500 to-blue-700",
  },
];

export function PremiumHeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative overflow-hidden">
        {/* Full-bleed background image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`bg-${current}`}
            src={slide.image}
            alt={slide.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={640}
          />
        </AnimatePresence>

        {/* Color overlay for text legibility */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-70`} />

        {/* Text content */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg py-10"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-base sm:text-lg mb-8">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.ctaLink}
                  className="inline-block px-8 py-3.5 bg-white text-foreground rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {slide.cta}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-4 bg-background">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
