import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: Mail, label: "Email", value: "info@chauhaancomputers.com", href: "mailto:info@chauhaancomputers.com" },
  { icon: MapPin, label: "Address", value: "Main Market Road, Near Bus Stand, Your City, India", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon – Sat: 10AM – 8PM", href: "#" },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 md:py-32 bg-foreground text-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1440px] mx-auto px-6 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">Contact Us</h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Have a question or need assistance? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <AnimatedSection>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Send us a Message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name" className="px-5 py-3.5 bg-surface rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 w-full" />
                  <input type="email" placeholder="Email Address" className="px-5 py-3.5 bg-surface rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 w-full" />
                </div>
                <input type="text" placeholder="Subject" className="px-5 py-3.5 bg-surface rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 w-full" />
                <textarea rows={5} placeholder="Your Message" className="px-5 py-3.5 bg-surface rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 w-full resize-none" />
                <button type="submit" className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, i) => (
                  <a key={i} href={info.href} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">{info.label}</p>
                      <p className="text-foreground font-medium group-hover:text-primary transition-colors">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
