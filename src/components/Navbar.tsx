import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown, Phone, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { SearchOverlay } from "./SearchOverlay";
import { categories, products } from "@/lib/data";

const navLinks = [
  { name: "Home", path: "/", dropdown: undefined },
  { name: "Laptops", path: "#", dropdown: "laptops" },
  { name: "Desktops", path: "/category/cpu-desktop", dropdown: undefined },
  { name: "Accessories", path: "#", dropdown: "accessories" },
  { name: "Deals", path: "#", dropdown: "deals" },
  { name: "Contact", path: "/contact", dropdown: undefined },
];

const accessories = [
  { name: "Keyboards", slug: "keyboards" },
  { name: "Mouse & Trackpads", slug: "mouse" },
  { name: "Monitors", slug: "monitors" },
  { name: "Headsets & Audio", slug: "headsets" },
  { name: "Cables & Adapters", slug: "cables" },
  { name: "Storage Devices", slug: "storage" },
];

const laptopCategories = categories.filter(c =>
  ["dell-laptop", "hp-laptop", "lenovo-laptop", "macbook"].includes(c.slug)
);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dealProducts = products.filter(p => p.originalPrice).slice(0, 4);

  const renderDropdown = (type: string) => {
    if (type === "laptops") {
      return (
        <div className="glass-card rounded-2xl p-6 w-[500px]">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Laptop Brands</p>
          <div className="grid grid-cols-2 gap-2">
            {laptopCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors group"
              >
                <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain rounded-lg bg-surface p-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    if (type === "accessories") {
      return (
        <div className="glass-card rounded-2xl p-6 w-[360px]">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Accessories</p>
          <div className="grid grid-cols-2 gap-1">
            {accessories.map((item) => (
              <Link
                key={item.slug}
                to={`/category/${item.slug}`}
                onClick={() => setActiveDropdown(null)}
                className="text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    if (type === "deals") {
      return (
        <div className="glass-card rounded-2xl p-6 w-[550px]">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">🔥 Today's Deals</p>
          <div className="grid grid-cols-2 gap-3">
            {dealProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors group"
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-lg bg-surface p-1 group-hover:scale-105 transition-transform" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-primary font-semibold">₹{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <nav className={`h-16 w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-elevated" : "bg-transparent border-b border-foreground/[0.05]"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">Chauhaan</span>
            <span className="text-lg font-light tracking-tight text-muted-foreground">Computers</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.dropdown!)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1">
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.dropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 -translate-x-1/2 pt-4"
                        style={{ top: "64px" }}
                      >
                        {renderDropdown(link.dropdown!)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path + link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    location.pathname === link.path ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <a
              href="tel:09829721157"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Phone className="w-3.5 h-3.5" />
              098297 21157
            </a>
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Login
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-muted-foreground hover:text-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.filter(l => !l.dropdown).map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className={`text-base font-medium py-2 ${location.pathname === link.path ? "text-foreground" : "text-muted-foreground"}`}>
                    {link.name}
                  </Link>
                ))}
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mt-4 mb-2">Laptops</p>
                {laptopCategories.map(cat => (
                  <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors pl-2">
                    {cat.name}
                  </Link>
                ))}
                <a href="tel:09829721157" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold w-fit">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
