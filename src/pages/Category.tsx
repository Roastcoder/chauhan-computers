import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedSection } from "@/components/AnimatedSection";
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
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-2">
            {categoryName}
          </h1>
          <p className="text-muted-foreground mb-8">{filtered.length} products</p>
        </AnimatedSection>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 text-sm font-medium text-foreground px-4 py-2.5 bg-surface rounded-full hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none text-sm font-medium text-foreground px-4 py-2.5 pr-8 bg-surface rounded-full outline-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-surface rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FilterGroup label="Price" options={priceRanges} value={priceFilter} onChange={setPriceFilter} />
                <FilterGroup label="RAM" options={ramOptions} value={ramFilter} onChange={setRamFilter} />
                <FilterGroup label="Storage" options={storageOptions} value={storageFilter} onChange={setStorageFilter} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            No products match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              value === opt
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
