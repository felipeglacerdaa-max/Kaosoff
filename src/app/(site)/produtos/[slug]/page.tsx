import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CATEGORY_LABELS } from "@/lib/types";
import {
  formatPrice,
  canPurchase,
  formatDateTime,
  getDiscountPercent,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isSold = product.status === "sold";
  const available = canPurchase(product);
  const isUpcoming =
    product.availableAt && new Date(product.availableAt) > new Date();
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="flex flex-col">
          <p className="text-[10px] tracking-widest uppercase text-ash">
            {CATEGORY_LABELS[product.category]}
          </p>

          <h1 className="font-display text-2xl md:text-3xl tracking-wide mt-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-ash line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount && <Badge variant="sale">−{discount}%</Badge>}
          </div>

          <div className="flex gap-2 mt-4">
            {product.isUnique && <Badge variant="unique">Peça única</Badge>}
            {isSold && <Badge variant="sold">Esgotado</Badge>}
          </div>

          <p className="mt-8 text-sm text-ash leading-relaxed">
            {product.description}
          </p>

          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex gap-4">
              <dt className="text-ash w-24 flex-shrink-0">Materiais</dt>
              <dd>{product.materials}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-ash w-24 flex-shrink-0">Dimensões</dt>
              <dd>{product.dimensions}</dd>
            </div>
          </dl>

          {isUpcoming && product.availableAt && (
            <div className="mt-10 p-6 bg-mist">
              <p className="text-[10px] tracking-widest uppercase text-ash mb-4">
                Disponível em {formatDateTime(product.availableAt)}
              </p>
              <CountdownTimer targetDate={product.availableAt} />
            </div>
          )}

          <div className="mt-10 space-y-3">
            {product.isCustomOrder ? (
              <Link href="/encomendas">
                <Button className="w-full">Solicitar encomenda</Button>
              </Link>
            ) : isSold ? (
              <Button disabled className="w-full">
                Peça esgotada
              </Button>
            ) : isUpcoming ? (
              <Button disabled className="w-full">
                Aguardando lançamento
              </Button>
            ) : available ? (
              <Link href={`/checkout?produto=${product.slug}`}>
                <Button className="w-full">Comprar agora</Button>
              </Link>
            ) : null}
          </div>

          <div className="mt-6 pt-6 border-t border-smoke">
            <p className="text-xs text-ash mb-2">
              Dúvidas sobre esta peça?
            </p>
            <WhatsAppButton productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
