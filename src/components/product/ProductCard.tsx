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
    <Link
      href={`/produtos/${product.slug}`}
      className="group block relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
            isSold ? "opacity-50" : ""
          }`}
          priority={priority}
        />

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/40">
            <span className="font-display text-sm tracking-[0.3em] uppercase">
              Esgotado
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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

      <div className="mt-4 space-y-1">
        <p className="text-[10px] tracking-widest uppercase text-ash">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="font-display text-sm tracking-wide group-hover:opacity-70 transition-opacity duration-300">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
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
