import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import {
  formatPrice,
  getDiscountPercent,
  canPurchase,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isSold = product.status === "sold";
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const available = canPurchase(product);

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-smoke/80 bg-mist shadow-[0_22px_60px_rgba(20,17,15,0.08)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_30px_80px_rgba(20,17,15,0.12)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-all duration-700 group-hover:scale-[1.05] ${
            isSold ? "opacity-60 grayscale" : ""
          }`}
          priority={priority}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/40 backdrop-blur-[1px]">
            <span className="font-display text-sm tracking-[0.3em] uppercase">
              Esgotado
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isUnique && !isSold && (
            <Badge variant="unique">Peça única</Badge>
          )}
          {hasDiscount && discount && (
            <Badge variant="sale">−{discount}%</Badge>
          )}
        </div>

        {!available && !isSold && product.availableAt && (
          <div className="absolute bottom-3 left-3">
            <Badge>Em breve</Badge>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2 rounded-[1.1rem] border border-transparent px-1 py-1 transition-colors duration-300 group-hover:border-smoke/70 group-hover:bg-paper/60">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ash">
            {CATEGORY_LABELS[product.category]}
          </p>
          {hasDiscount && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-ash">
              Oferta
            </span>
          )}
        </div>
        <h3 className="font-display text-sm tracking-wide transition-opacity duration-300 group-hover:opacity-70">
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between gap-2 border-t border-smoke/70 pt-3">
          <span className="text-sm">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-ash line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
