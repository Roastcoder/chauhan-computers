import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Star, Cpu, HardDrive, MemoryStick, Monitor } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Product not found.
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const [activeImage, setActiveImage] = useState(product.image);
  const allImages = product.images || [product.image];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          {" / "}
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors capitalize">{product.category.replace(/-/g, ' ')}</Link>
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="bg-muted/30 rounded-3xl p-12 md:p-16 flex items-center justify-center aspect-square overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain drop-shadow-2xl max-w-[400px]"
                />
              </AnimatePresence>
            </motion.div>

            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar justify-center sm:justify-start">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain bg-white p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:sticky lg:top-24 lg:self-start">
            {product.badge && (
              <span className="text-xs font-medium tracking-wide uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">{product.badge}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              <span className="text-sm text-muted-foreground">· {product.brand}</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold text-foreground tabular-nums">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through tabular-nums">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <p className="text-muted-foreground text-[17px] leading-relaxed mb-8">{product.description}</p>

            {product.specs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {product.specs.map((spec, i) => {
                  const Icon = specIcons[i] || Cpu;
                  return (
                    <div key={i} className="bg-muted/30 rounded-2xl p-4 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-foreground">{spec}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-8">You Might Also Like</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
