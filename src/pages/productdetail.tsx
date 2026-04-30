import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Heart, Star, Cpu, HardDrive, MemoryStick, Monitor, 
  MessageCircle, Truck, ShieldCheck, RefreshCw, CheckCircle2, ChevronRight 
} from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const specIcons: Record<string, any> = {
  0: Cpu, 1: MemoryStick, 2: HardDrive, 3: Monitor,
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { data: products = [], isLoading } = useProducts();

  const product = products.find((p) => p.id === id);
  const allImages = product?.images || [product?.image].filter(Boolean);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (allImages.length > 0) setActiveImage(allImages[0]);
  }, [allImages.length, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground gap-4">
        <p className="text-xl font-medium">Product not found.</p>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWhatsApp = () => {
    const text = `Hi, I'm interested in the ${product.name} (Price: ₹${product.price}). Can you provide more details? https://chauhancomputers.co.in/product/${product.id}`;
    window.open(`https://wa.me/919829721157?text=${encodeURIComponent(text)}`, "_blank");
  };

  const discounted = product.specs?.originalPrice ? Math.round(((product.specs.originalPrice - product.price) / product.specs.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 md:py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground mb-4 md:mb-6 overflow-hidden whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to={`/category/${product.category}`} className="hover:text-primary transition-colors capitalize shrink-0">{product.category.replace(/-/g, ' ')}</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white rounded-[2rem] p-4 md:p-8 flex items-center justify-center aspect-square overflow-hidden shadow-sm border border-slate-100"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-contain drop-shadow-lg max-h-[400px]"
                />
              </AnimatePresence>
            </motion.div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white p-1.5 ${
                      activeImage === img ? "border-primary ring-2 ring-primary/10 shadow-md" : "border-transparent hover:border-slate-200"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 space-y-4 md:space-y-6"
          >
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-slate-900 px-3 py-1.5 rounded-full">{product.brand}</span>
                {product.badge && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-blue-600 px-3 py-1.5 rounded-full">{product.badge}</span>
                )}
                {discounted > 0 && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-emerald-500 px-3 py-1.5 rounded-full">Save {discounted}%</span>
                )}
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">{product.rating}</span>
                </div>
                <span className="text-sm font-medium text-slate-500 underline underline-offset-4 decoration-slate-200 cursor-pointer">{product.reviews} customer reviews</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                {product.specs?.originalPrice && (
                  <span className="text-xl text-slate-400 line-through font-medium">₹{product.specs.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-xs text-emerald-600 font-semibold mb-6 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Inclusive of all taxes · Free Delivery
              </p>

              <div className="flex flex-col gap-3">
                <button onClick={handleAdd}
                  className="group relative w-full h-14 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </div>
                </button>
                
                <div className="grid grid-cols-5 gap-3">
                  <button onClick={handleWhatsApp}
                    className="col-span-4 h-14 border-2 border-emerald-500/20 bg-emerald-50 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors active:scale-95">
                    <MessageCircle className="w-5 h-5" />
                    <span>Inquire on WhatsApp</span>
                  </button>
                  <button className="col-span-1 h-14 border-2 border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-2xl flex items-center justify-center transition-all active:scale-95">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specs || {}).map(([key, val], i) => {
                if (['originalPrice', 'badge', 'list'].includes(key)) return null;
                const Icon = i === 0 ? Cpu : i === 1 ? MemoryStick : i === 2 ? HardDrive : Monitor;
                return (
                  <div key={key} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-slate-400" strokeWidth={2} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{key}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{val as string}</p>
                  </div>
                );
              })}
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Technical Highlights</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.specs?.list?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{item}</span>
                  </div>
                )) || <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>}
              </div>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight">1 Year<br/>Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight">7 Days<br/>Replacement</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase leading-tight">Fast Free<br/>Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description Section */}
        <div className="mt-20 max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Product Overview</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-base text-slate-600 leading-relaxed italic border-l-4 border-primary pl-6">
              "{product.description}"
            </p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Recommended for You</h2>
              <Link to={`/category/${product.category}`} className="text-primary text-xs md:text-sm font-bold hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}

        {/* Trending Now Section */}
        <section className="mt-16 md:mt-24 border-t border-slate-100 pt-16 md:pt-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Trending Now</h2>
            <Link to="/category/all" className="text-primary text-xs md:text-sm font-bold hover:underline">Explore all products →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products
              .filter(p => p.id !== product.id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4)
              .map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
