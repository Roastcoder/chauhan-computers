import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { SearchOverlay } from "./SearchOverlay";
import { categories, products, services } from "@/lib/data";

const accessories = [
  { name: "Keyboards", slug: "keyboards" },
  { name: "Mouse & Trackpads", slug: "mouse" },
  { name: "Monitors", slug: "monitors" },
  { name: "Headsets & Audio", slug: "headsets" },
  { name: "Cables & Adapters", slug: "cables" },
  { name: "Storage Devices", slug: "storage" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "#", dropdown: "products" },
  { name: "Accessories", path: "#", dropdown: "accessories" },
  { name: "Services", path: "#", dropdown: "services" },
  { name: "About Us", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const categoryProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory).slice(0, 4)
    : products.slice(0, 4);

  const renderDropdown = (type: string) => {
    if (type === "products") {
      return (
        <div className="bg-background rounded-2xl shadow-elevated border border-foreground/[0.05] p-6 w-[700px] flex gap-6">
          <div className="w-48 shrink-0 space-y-1">
            <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onMouseEnter={() => setActiveCategory(cat.slug)}
                onClick={() => setActiveDropdown(null)}
                className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-surface text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">Popular Products</p>
            <div className="grid grid-cols-2 gap-3">
              {categoryProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-contain rounded-lg bg-surface p-1 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-primary font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (type === "accessories") {
      return (
        <div className="bg-background rounded-2xl shadow-elevated border border-foreground/[0.05] p-6 w-[360px]">
          <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">Accessories</p>
          <div className="grid grid-cols-2 gap-1">
            {accessories.map((item) => (
              <Link
                key={item.slug}
                to={`/category/${item.slug}`}
                onClick={() => setActiveDropdown(null)}
                className="text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    if (type === "services") {
      return (
        <div className="bg-background rounded-2xl shadow-elevated border border-foreground/[0.05] p-6 w-[400px]">
          <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">Our Services</p>
          <div className="space-y-1">
            {services.map((service) => (
              <Link
                key={service.id}
                to="/services"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-10 h-10 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{service.description.slice(0, 50)}…</p>
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
      <nav className="h-16 w-full sticky top-0 z-50 border-b border-foreground/[0.05] bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-bold tracking-tight text-foreground">Chauhaan</span>
            <span className="text-xl font-light tracking-tight text-muted-foreground">Computers</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => {
                    setActiveDropdown(link.dropdown!);
                    if (link.dropdown === "products" && !activeCategory)
                      setActiveCategory(categories[0]?.slug || null);
                  }}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1">
                    {link.name}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.dropdown ? "rotate-180" : ""}`}
                    />
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

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-muted-foreground hover:text-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-foreground/[0.05] overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks
                  .filter((l) => !l.dropdown)
                  .map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-medium py-2 ${
                        location.pathname === link.path ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mt-4 mb-2">Products</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors pl-2"
                  >
                    {cat.name}
                  </Link>
                ))}
                <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mt-4 mb-2">Services</p>
                {services.map((s) => (
                  <Link
                    key={s.id}
                    to="/services"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium py-1.5 text-muted-foreground hover:text-foreground transition-colors pl-2"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
