import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Users, Award, MapPin, Clock } from "lucide-react";

const stats = [
  { icon: Users, label: "Happy Customers", value: "10,000+" },
  { icon: Award, label: "Years of Trust", value: "15+" },
  { icon: MapPin, label: "Service Centers", value: "5" },
  { icon: Clock, label: "Support Available", value: "24/7" },
];

const team = [
  { name: "Rajesh Chauhaan", role: "Founder & CEO", bio: "With 15+ years in the tech industry, Rajesh founded Chauhaan Computers with a vision to provide premium technology solutions." },
  { name: "Meera Chauhaan", role: "Operations Head", bio: "Meera ensures every customer receives exceptional service and manages the day-to-day operations seamlessly." },
  { name: "Amit Verma", role: "Technical Lead", bio: "Certified hardware engineer with expertise in laptop, desktop, and CCTV installations across all major brands." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-foreground text-background overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <p className="text-xs font-medium tracking-widest uppercase opacity-40 mb-4">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            Your Trusted Tech Partner
          </h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Since 2010, Chauhaan Computers has been delivering premium technology solutions,
            expert repair services, and unmatched customer support to businesses and individuals alike.
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/50 pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-background rounded-2xl p-6 text-center shadow-ambient">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-prose text-lg leading-relaxed mb-4">
                At Chauhaan Computers, we believe everyone deserves access to reliable, high-performance technology.
                We carefully select and test every product we sell to ensure it meets our rigorous standards.
              </p>
              <p className="text-prose text-lg leading-relaxed">
                Beyond sales, our expert repair technicians are trained to diagnose and fix any issue —
                from laptop screens to CCTV systems. We're not just a store; we're your complete technology partner.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-surface rounded-3xl p-12 text-center">
                <p className="text-6xl font-bold text-primary mb-4">15+</p>
                <p className="text-xl font-medium text-foreground">Years of Excellence</p>
                <p className="text-muted-foreground mt-2">Serving customers since 2010</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-12">
              Meet Our Team
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-background rounded-3xl p-8 shadow-ambient text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{member.name[0]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
