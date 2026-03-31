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
      <div className={`relative bg-gradient-to-r ${slide.bg} transition-colors duration-700`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center min-h-[280px] sm:min-h-[340px] md:min-h-[380px]">
            {/* Left: Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="flex-1 py-8 md:py-12 z-10"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 max-w-md">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.ctaLink}
                  className="inline-block px-8 py-3 bg-white text-foreground rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md"
                >
                  {slide.cta}
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Right: Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${current}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex justify-center md:justify-end"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full max-w-[500px] h-[200px] sm:h-[260px] md:h-[320px] object-cover rounded-xl"
                  width={500}
                  height={320}
                />
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
