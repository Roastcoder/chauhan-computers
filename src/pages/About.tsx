import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Users, Award, MapPin, Clock } from "lucide-react";
import bannerBusiness from "@/assets/banner-business.jpg";

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
    <div className="bg-background">
      {/* Hero Banner */}
      <section className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={bannerBusiness} alt="About Chauhaan Computers" className="w-full h-[200px] sm:h-[280px] md:h-[320px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
              <div className="px-6 sm:px-10 md:px-12">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Our Story</p>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-3">Your Trusted Tech Partner</h1>
                <p className="text-white/80 text-sm sm:text-base max-w-lg">Since 2010, delivering premium technology solutions and expert services in Jaipur.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-5 text-center border border-border">
                  <stat.icon className="w-7 h-7 text-primary mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8 sm:py-10 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimatedSection>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                At Chauhaan Computers, we believe everyone deserves access to reliable, high-performance technology.
                We carefully select and test every product we sell to ensure it meets our rigorous standards.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Beyond sales, our expert repair technicians are trained to diagnose and fix any issue —
                from laptop screens to CCTV systems. We're not just a store; we're your complete technology partner.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-card rounded-xl p-8 text-center border border-border">
                <p className="text-5xl font-bold text-primary mb-2">15+</p>
                <p className="text-lg font-medium text-foreground">Years of Excellence</p>
                <p className="text-sm text-muted-foreground mt-1">Serving customers since 2010</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {team.map((member, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-6 border border-border text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{member.name[0]}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
