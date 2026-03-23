import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroPrimary from "@/assets/hero-banner-premium.png";
import heroSecondary from "@/assets/hero-banner-secondary.png";

const slides = [
  {
    image: heroPrimary,
    subtitle: "New Arrival",
    title: "Elegance Meets\nPerformance.",
    description: "Precision-crafted devices that redefine what's possible. Experience computing at its finest.",
    cta: "Explore Collection",
    ctaLink: "/category/macbook",
    accent: "rose",
  },
  {
    image: heroSecondary,
    subtitle: "Essential Accessories",
    title: "Complete Your\nSetup.",
    description: "Premium accessories designed to complement your workflow with seamless integration.",
    cta: "Shop Accessories",
    ctaLink: "/category/macbook",
    accent: "gold",
  },
];

export function PremiumHeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

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

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.98 }),
  };

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-background">
      {/* Parallax background gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: parallaxY }}
      >
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            slide.accent === "rose"
              ? "bg-gradient-to-br from-rose-50 via-background to-amber-50/30"
              : "bg-gradient-to-br from-amber-50/40 via-background to-rose-50/20"
          }`}
        />
        {/* Soft orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-rose-200/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-200/15 blur-[100px]" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-[1440px] mx-auto px-6 pt-24"
        style={{ opacity }}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8"
          >
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-rose-400"
              >
                {slide.subtitle}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-foreground leading-[1.05] whitespace-pre-line"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                {slide.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-6 justify-center lg:justify-start pt-2"
              >
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-foreground/10"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              className="flex-1 flex justify-center relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative">
                {/* Soft glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-b from-rose-300/20 to-amber-200/10 rounded-[3rem] blur-[60px] scale-90" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative z-10 w-full max-w-2xl rounded-3xl object-cover shadow-2xl shadow-foreground/5"
                />
                {/* Floating accent */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-rose-300 to-amber-300 rounded-2xl opacity-60 blur-sm z-0"
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="flex items-center justify-center lg:justify-start gap-6 mt-16">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
                style={{ width: i === current ? 40 : 16 }}
              >
                <div className="absolute inset-0 bg-foreground/10 rounded-full" />
                {i === current && (
                  <motion.div
                    className="absolute inset-0 bg-foreground rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
