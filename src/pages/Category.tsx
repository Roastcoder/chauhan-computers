import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/data";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];
const priceRanges = ["All", "Under ₹1,000", "₹1,000 – ₹2,000", "₹2,000 – ₹3,000", "Over ₹3,000"];
const ramOptions = ["All", "16GB", "32GB", "64GB"];
const storageOptions = ["All", "512GB SSD", "1TB SSD", "2TB SSD"];

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [sort, setSort] = useState("Featured");
  const [priceFilter, setPriceFilter] = useState("All");
  const [ramFilter, setRamFilter] = useState("All");
  const [storageFilter, setStorageFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name || (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "All Products");

  const filtered = useMemo(() => {
    let result = slug ? products.filter((p) => p.category === slug) : products;
    if (priceFilter !== "All") {
      result = result.filter((p) => {
        if (priceFilter === "Under ₹1,000") return p.price < 1000;
        if (priceFilter === "₹1,000 – ₹2,000") return p.price >= 1000 && p.price <= 2000;
        if (priceFilter === "₹2,000 – ₹3,000") return p.price >= 2000 && p.price <= 3000;
        if (priceFilter === "Over ₹3,000") return p.price > 3000;
        return true;
      });
    }
    if (ramFilter !== "All") result = result.filter((p) => p.ram === ramFilter);
    if (storageFilter !== "All") result = result.filter((p) => p.storage === storageFilter);
    if (sort === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    return result;
  }, [slug, sort, priceFilter, ramFilter, storageFilter]);

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">{categoryName}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{categoryName}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{filtered.length} products</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </button>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="appearance-none text-xs font-medium text-foreground px-3 py-2 pr-7 bg-card border border-border rounded-lg outline-none cursor-pointer">
                  {sortOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                <div className="bg-card rounded-xl p-4 border border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FilterGroup label="Price" options={priceRanges} value={priceFilter} onChange={setPriceFilter} />
                  <FilterGroup label="RAM" options={ramOptions} value={ramFilter} onChange={setRamFilter} />
                  <FilterGroup label="Storage" options={storageOptions} value={storageFilter} onChange={setStorageFilter} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">No products match your filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
              value === opt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
