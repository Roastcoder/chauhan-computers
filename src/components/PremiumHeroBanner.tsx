import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import heroPrimary from "@/assets/hero-banner-premium.png";
import heroSecondary from "@/assets/hero-banner-secondary.png";

const slides = [
  {
    image: heroPrimary,
    subtitle: "⚡ Open Today — Closes at 9 PM",
    title: "Power Meets\nPrecision.",
    description: "Jaipur's most trusted destination for laptops, desktops & accessories — Malviya Nagar, Jaipur",
    cta: "Shop Now",
    ctaLink: "/category/macbook",
  },
  {
    image: heroSecondary,
    subtitle: "New Collection Available",
    title: "Built for\nProfessionals.",
    description: "Premium laptops & desktops with expert setup. Free delivery across Jaipur.",
    cta: "Explore Range",
    ctaLink: "/category/dell-laptop",
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
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden gradient-mesh animate-mesh">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-cyan/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 pt-16">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8"
          >
            {/* Text */}
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-xl">
              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-xs font-medium text-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 pulse-green" />
                {slide.subtitle}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] whitespace-pre-line"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                {slide.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 justify-center lg:justify-start pt-2"
              >
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all glow-primary"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="tel:09829721157"
                  className="inline-flex items-center gap-2 px-6 py-4 border border-foreground/20 text-foreground rounded-full font-medium text-sm hover:bg-foreground/5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Us Now
                </a>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              className="flex-1 flex justify-center relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-[60px] scale-90" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative z-10 w-full max-w-lg rounded-3xl object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center lg:justify-start gap-6 mt-16">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
                style={{ width: i === current ? 40 : 16 }}
              >
                <div className="absolute inset-0 bg-foreground/10 rounded-full" />
                {i === current && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
