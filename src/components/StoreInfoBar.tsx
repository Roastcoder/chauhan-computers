import { MapPin, Clock, Phone, Globe } from "lucide-react";

export function StoreInfoBar() {
  return (
    <div className="w-full glass border-b border-foreground/[0.04] py-2">
      <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-primary" />
          Shop No B-5, Girdhar Marg, Malviya Nagar, Jaipur — 302017
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-cyan" />
          Mon–Sun: Open until 9:00 PM
        </span>
        <a href="tel:09829721157" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Phone className="w-3 h-3 text-primary" />
          098297 21157
        </a>
        <span className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-cyan" />
          Serving customers across India
        </span>
      </div>
    </div>
  );
}
