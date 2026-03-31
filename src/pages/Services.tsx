import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PromoBanner } from "@/components/PromoBanner";
import { services } from "@/lib/data";
import { Laptop, Printer, Cpu, Camera } from "lucide-react";
import bannerEmi from "@/assets/banner-emi.jpg";

const iconMap: Record<string, any> = {
  laptop: Laptop,
  printer: Printer,
  cpu: Cpu,
  camera: Camera,
};

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <p className="text-xs font-medium tracking-widest uppercase opacity-40 mb-4">Expert Solutions</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            Our Services
          </h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Professional repair and installation services by certified technicians. We fix it right, the first time.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="space-y-16">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Cpu;
              const isEven = i % 2 === 0;

              return (
                <AnimatedSection key={service.id} delay={i * 0.1}>
                  <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}>
                    <motion.div
                      className="flex-1 rounded-3xl overflow-hidden shadow-elevated"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                    </motion.div>
                    <div className="flex-1 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                        {service.name}
                      </h3>
                      <p className="text-prose text-lg leading-relaxed">
                        {service.description}
                      </p>
                      <a
                        href="/contact"
                        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity mt-2"
                      >
                        Book Service
                      </a>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* EMI Banner */}
      <div className="py-8 bg-background">
        <PromoBanner
          image={bannerEmi}
          title="0% EMI on All Services & Products"
          subtitle="Easy Financing"
          cta="Learn More"
          ctaLink="/contact"
          overlay="gradient"
        />
      </div>

      {/* CTA */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              We also offer custom PC builds, network setup, and IT consultation for businesses. Get in touch!
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
