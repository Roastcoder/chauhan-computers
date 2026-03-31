import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroSlide1,
    title: "Power Meets Precision",
    cta: "Shop Now",
    ctaLink: "/category/macbook",
  },
  {
    image: heroSlide2,
    title: "Premium Laptops for Every Budget",
    cta: "Explore Range",
    ctaLink: "/category/dell-laptop",
  },
  {
    image: heroSlide3,
    title: "Gaming Setups & Accessories",
    cta: "Shop Gaming",
    ctaLink: "/category/keyboards",
  },
];

export function PremiumHeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Full-bleed image carousel */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            width={1920}
            height={720}
          />
          {/* Gradient overlay — bottom only for legible text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Minimal text overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 md:pb-14">
        <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-6">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl drop-shadow-lg">
              {slide.title}
            </h1>
            <Link
              to={slide.ctaLink}
              className="group mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Nav controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-500"
            style={{ width: i === current ? 32 : 12 }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full" />
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
