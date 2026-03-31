import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/hooks/use-banners";
import cashifyHero1 from "@/assets/cashify-hero-1.jpg";
import cashifyHero2 from "@/assets/cashify-hero-2.jpg";
import cashifyHero3 from "@/assets/cashify-hero-3.jpg";

const fallbackSlides = [
  { image: cashifyHero1, title: "Best Deals on Laptops & Desktops", subtitle: "Up to 40% off on top brands", cta: "Shop Now", ctaLink: "/category/dell-laptop" },
  { image: cashifyHero2, title: "Gaming Laptops & Accessories", subtitle: "High-performance setups for every gamer", cta: "Explore Gaming", ctaLink: "/category/keyboards" },
  { image: cashifyHero3, title: "Premium Apple Products", subtitle: "MacBook, iMac & more at unbeatable prices", cta: "Shop Apple", ctaLink: "/category/macbook" },
];

export function PremiumHeroBanner() {
  const [current, setCurrent] = useState(0);
  const { data: dbBanners } = useBanners("home", "hero");

  const slides = dbBanners && dbBanners.length > 0
    ? dbBanners.map(b => ({ image: b.image_url, title: b.title, subtitle: b.subtitle, cta: b.cta_text, ctaLink: b.cta_link }))
    : fallbackSlides;

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length, current]);

  const slide = slides[current] || slides[0];
  if (!slide) return null;

  return (
    <section className="w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
        <div className="relative rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[200px] sm:h-[280px] md:h-[360px] lg:h-[400px] object-cover"
                width={1920}
                height={640}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 md:px-12 max-w-lg">
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3 drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 drop-shadow">
                    {slide.subtitle}
                  </p>
                  <Link to={slide.ctaLink}
                    className="inline-block px-5 sm:px-7 py-2 sm:py-3 bg-white text-foreground rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors shadow-md">
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={next}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "bg-white w-5" : "bg-white/40 w-2"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
