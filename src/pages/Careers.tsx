import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Briefcase, MapPin } from "lucide-react";

const openings = [
  { title: "Sales Executive", location: "In-Store", type: "Full-time", description: "Help customers find the perfect tech solutions. Must have excellent communication skills." },
  { title: "Hardware Technician", location: "Service Center", type: "Full-time", description: "Diagnose and repair laptops, desktops, and printers. 2+ years experience required." },
  { title: "CCTV Installation Engineer", location: "Field", type: "Full-time", description: "Install and configure CCTV systems for residential and commercial clients." },
  { title: "Digital Marketing Specialist", location: "Remote", type: "Part-time", description: "Manage our online presence, social media, and advertising campaigns." },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 md:py-32 bg-foreground text-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">Careers</h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Join our team and help shape the future of tech retail and services.
          </p>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-8">Open Positions</h2>
          </AnimatedSection>

          <div className="space-y-4">
            {openings.map((job, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-surface rounded-2xl p-6 hover:shadow-elevated transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{job.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                    </div>
                    <a href="/contact" className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      Apply
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
