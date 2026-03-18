import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-surface rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
          {product.badge && (
            <span className="absolute top-4 left-4 text-xs font-medium tracking-wide uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          <div className="w-full aspect-square flex items-center justify-center mb-4">
            {product.image ? (
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-contain"
                whileHover={{ scale: 1.1, rotateY: 8 }}
                transition={{ duration: 0.4 }}
                style={{ perspective: "800px" }}
              />
            ) : (
              <div className="w-32 h-32 bg-muted rounded-2xl transition-transform duration-500 group-hover:scale-105" />
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary tabular-nums">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
