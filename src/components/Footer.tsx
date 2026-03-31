import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const footerLinks = {
  Products: [
    { name: "Laptops", path: "/category/dell-laptop" },
    { name: "Desktops", path: "/category/cpu-desktop" },
    { name: "MacBooks", path: "/category/macbook" },
    { name: "Printers", path: "/category/printers" },
  ],
  Services: [
    { name: "Laptop Repair", path: "/services" },
    { name: "Printer Repair", path: "/services" },
    { name: "CPU Repair", path: "/services" },
    { name: "CCTV Installation", path: "/services" },
  ],
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface border-t border-foreground/[0.05]">
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="Chauhaan Computers" className="w-8 h-8" />
              <span className="text-lg font-bold text-foreground">Chauhaan</span>
              <span className="text-lg font-light text-muted-foreground">Computers</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-4">
              Your Trusted Tech Partner in Jaipur. Premium hardware & expert services since 2010.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3 text-primary" />
              Malviya Nagar, Jaipur
            </div>
            <a href="tel:09829721157" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-3 h-3 text-primary" />
              098297 21157
            </a>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-foreground/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 Chauhaan Computers — Shop No B-5, Malviya Nagar, Jaipur 302017</p>
          <div className="flex gap-4">
            <a
              href="https://wa.me/919829721157"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-500 hover:text-green-400 transition-colors font-medium"
            >
              WhatsApp
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
