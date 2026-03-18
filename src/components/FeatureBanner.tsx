import { motion } from "framer-motion";
import { ShieldCheck, Truck, Headphones, RefreshCw } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "1 Year Warranty",
    description: "Full coverage on all products",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above ₹5,000",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert help anytime",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
];

export function FeatureBanner() {
  return (
    <section className="py-16 bg-background border-y border-foreground/[0.05]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
              >
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
