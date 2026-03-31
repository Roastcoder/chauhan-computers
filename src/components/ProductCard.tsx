import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/data";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCart();

  const badgeColor = product.badge === "New"
    ? "bg-cyan/20 text-cyan"
    : "bg-destructive/20 text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:glow-primary">
        {product.badge && (
          <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full ${badgeColor}`}>
            {product.badge}
          </span>
        )}

        <Link to={`/product/${product.id}`} className="w-full">
          <div className="w-full aspect-square flex items-center justify-center mb-4 overflow-hidden">
            {product.image ? (
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-contain transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-32 h-32 bg-surface-light rounded-2xl" />
            )}
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-1 truncate w-full">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                className={`w-3 h-3 ${j < Math.round(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-primary tabular-nums">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
          }}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
