import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown, Phone, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { SearchOverlay } from "./SearchOverlay";
import { categories, products } from "@/lib/data";
import logoIcon from "@/assets/logo-cc.png";

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

const mobileMenuLinks = [
  { name: "Home", path: "/" },
  { name: "Desktops", path: "/category/cpu-desktop" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSub(null);
  }, [location.pathname]);

  const dealProducts = products.filter(p => p.originalPrice).slice(0, 4);

  const renderDropdown = (type: string) => {
    if (type === "laptops") {
      return (
        <div className="bg-card rounded-xl p-5 w-[480px] shadow-lg border border-border">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Laptop Brands</p>
          <div className="grid grid-cols-2 gap-1">
            {laptopCategories.map((cat) => (
              <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors group">
                <img src={cat.image} alt={cat.name} className="w-9 h-9 object-contain rounded bg-muted p-1" />
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }
    if (type === "accessories") {
      return (
        <div className="bg-card rounded-xl p-5 w-[320px] shadow-lg border border-border">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Accessories</p>
          <div className="grid grid-cols-2 gap-0.5">
            {accessories.map((item) => (
              <Link key={item.slug} to={`/category/${item.slug}`} onClick={() => setActiveDropdown(null)}
                className="text-sm py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }
    if (type === "deals") {
      return (
        <div className="bg-card rounded-xl p-5 w-[500px] shadow-lg border border-border">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">🔥 Today's Deals</p>
          <div className="grid grid-cols-2 gap-2">
            {dealProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group">
                <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded bg-muted p-1" />
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
      <nav className={`h-14 sm:h-16 w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-card border-b border-border"
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoIcon} alt="Chauhan Computers" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover" />
            <div className="hidden sm:block">
              <span className="text-base font-bold text-foreground leading-none">Chauhan</span>
              <span className="text-base font-light text-muted-foreground leading-none ml-1">Computers</span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search for laptops, accessories & more
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="relative"
                  onMouseEnter={() => setActiveDropdown(link.dropdown!)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                  <button className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1">
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.dropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.dropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 4 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }} 
                        className="absolute left-1/2 -translate-x-1/2 pt-2 top-full"
                      >
                        {renderDropdown(link.dropdown!)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.path + link.name} to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === link.path ? "text-foreground" : "text-muted-foreground"}`}>
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearchOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground p-1.5">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="text-muted-foreground hover:text-foreground relative p-1.5">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <User className="w-3.5 h-3.5" />
              Login
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-muted-foreground hover:text-foreground p-1.5">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-card z-50 lg:hidden shadow-xl overflow-y-auto"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <img src={logoIcon} alt="Chauhan Computers" className="w-8 h-8" />
                  <span className="text-sm font-bold text-foreground">Chauhan Computers</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {/* Login Button on Mobile */}
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold mb-3">
                  <User className="w-4 h-4" /> Login / Sign Up
                </Link>

                {/* Main links */}
                {mobileMenuLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}>
                    {link.name}
                  </Link>
                ))}

                {/* Laptops expandable */}
                <button onClick={() => setMobileSub(mobileSub === "laptops" ? null : "laptops")}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                  Laptops
                  <ChevronRight className={`w-4 h-4 transition-transform ${mobileSub === "laptops" ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileSub === "laptops" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4">
                      {laptopCategories.map(cat => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                          <img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain" />
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Accessories expandable */}
                <button onClick={() => setMobileSub(mobileSub === "accessories" ? null : "accessories")}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                  Accessories
                  <ChevronRight className={`w-4 h-4 transition-transform ${mobileSub === "accessories" ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileSub === "accessories" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4">
                      {accessories.map(item => (
                        <Link key={item.slug} to={`/category/${item.slug}`} onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Call */}
                <div className="pt-4 border-t border-border mt-4">
                  <a href="tel:09509317543" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary">
                    <Phone className="w-4 h-4" /> 95093 17543
                  </a>
                  <a href="tel:08559965655" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" /> 85599 65655
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
