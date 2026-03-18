import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { SearchOverlay } from "./SearchOverlay";
import { categories, products } from "@/lib/data";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "#", hasDropdown: true },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const categoryProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory).slice(0, 4)
    : products.slice(0, 4);

  return (
    <>
      <nav className="h-16 w-full sticky top-0 z-50 border-b border-foreground/[0.05] bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-bold tracking-tight text-foreground">Chauhaan</span>
            <span className="text-xl font-light tracking-tight text-muted-foreground">Computers</span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => {
                    setDropdownOpen(true);
                    if (!activeCategory) setActiveCategory(categories[0]?.slug || null);
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1"
                  >
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                      >
                        <div className="bg-background rounded-2xl shadow-elevated border border-foreground/[0.05] p-6 w-[700px] flex gap-6">
                          {/* Category List */}
                          <div className="w-48 shrink-0 space-y-1">
                            <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">Categories</p>
                            {categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                onMouseEnter={() => setActiveCategory(cat.slug)}
                                onClick={() => setDropdownOpen(false)}
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

                          {/* Products Preview */}
                          <div className="flex-1">
                            <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">Popular Products</p>
                            <div className="grid grid-cols-2 gap-3">
                              {categoryProducts.map((product) => (
                                <Link
                                  key={product.id}
                                  to={`/product/${product.id}`}
                                  onClick={() => setDropdownOpen(false)}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
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
                {navLinks.filter(l => !l.hasDropdown).map((link) => (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
