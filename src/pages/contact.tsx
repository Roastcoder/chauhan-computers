import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { api } from "@/integrations/supabase/client";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "098297 21157", href: "tel:09829721157" },
  { icon: Mail, label: "Email", value: "info@chauhaancomputers.com", href: "mailto:info@chauhaancomputers.com" },
  { icon: MapPin, label: "Address", value: "Shop No B-5, Girdhar Marg, Malviya Nagar, Jaipur 302017", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon – Sun: Open until 9:00 PM", href: "#" },
];

import { SEO } from "@/components/SEO";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSending(true);
    try {
      await api.post("/contact-messages", form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {}
    setSending(false);
  };

  return (
    <div className="bg-background">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Chauhan Computers for laptop repairs, IT services, or sales inquiries in Jaipur. We're here to help."
        keywords="contact chauhan computers, laptop repair jaipur contact, computer shop jaipur phone number"
      />
      {/* Header */}
      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Contact Us</h1>
          <p className="text-sm text-muted-foreground">Have a question or need assistance? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <AnimatedSection>
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Send us a Message</h2>
                {sent ? (
                  <div className="py-8 text-center">
                    <p className="text-green-500 font-semibold mb-1">Message sent!</p>
                    <p className="text-xs text-muted-foreground">We'll get back to you soon.</p>
                    <button onClick={() => setSent(false)} className="mt-4 text-xs text-primary hover:underline">Send another</button>
                  </div>
                ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name *" required className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full" />
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email Address" className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full" />
                  </div>
                  <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject" className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full" />
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your Message *" required className="px-4 py-2.5 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border w-full resize-none" />
                  <button type="submit" disabled={sending} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
                )}
              </div>
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection delay={0.2}>
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, i) => (
                    <a key={i} href={info.href} className="flex items-start gap-3 group">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <info.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">{info.label}</p>
                        <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Map */}
                <div className="mt-5 rounded-lg overflow-hidden h-48">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.0!2d75.8!3d26.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUxJzAwLjAiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                    title="Chauhan Computers Location"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
