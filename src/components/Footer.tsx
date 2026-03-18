import { Link } from "react-router-dom";

const footerLinks = {
  "Products": [
    { name: "CPU | Desktop Setup", path: "/category/cpu-desktop" },
    { name: "Dell Laptop", path: "/category/dell-laptop" },
    { name: "HP Laptop", path: "/category/hp-laptop" },
    { name: "Lenovo Laptop", path: "/category/lenovo-laptop" },
    { name: "MacBook", path: "/category/macbook" },
    { name: "Printers", path: "/category/printers" },
  ],
  "Services": [
    { name: "Laptop Repair", path: "/services" },
    { name: "Printer Repair", path: "/services" },
    { name: "CPU Repair", path: "/services" },
    { name: "CCTV Installation", path: "/services" },
  ],
  "Company": [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xl font-bold">Chauhaan</span>
              <span className="text-xl font-light opacity-60">Computers</span>
            </div>
            <p className="text-sm opacity-50 leading-relaxed max-w-xs">
              Your Trusted Tech Partner. Precision-engineered hardware and expert repair services for those who build the future.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-medium tracking-wide uppercase opacity-40 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-40">© 2026 Chauhaan Computers. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs opacity-40 hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="text-xs opacity-40 hover:opacity-100 transition-opacity">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
