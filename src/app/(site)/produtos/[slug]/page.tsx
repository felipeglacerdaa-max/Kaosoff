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
    <div className="px-6 py-12 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-smoke/80 bg-gradient-to-br from-paper via-mist/50 to-paper p-6 shadow-[0_20px_80px_rgba(20,17,15,0.06)] md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:p-10">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-[0.35em] text-ash">
            {CATEGORY_LABELS[product.category]}
          </p>

          <h1 className="mt-2 font-display text-2xl tracking-wide md:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-lg font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-ash line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount && <Badge variant="sale">−{discount}%</Badge>}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.isUnique && <Badge variant="unique">Peça única</Badge>}
            {isSold && <Badge variant="sold">Esgotado</Badge>}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-ash">
            {product.description}
          </p>

          <div className="mt-8 rounded-[1.25rem] border border-smoke/70 bg-paper/90 p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex gap-4">
                <dt className="w-24 flex-shrink-0 text-ash">Materiais</dt>
                <dd>{product.materials}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 flex-shrink-0 text-ash">Dimensões</dt>
                <dd>{product.dimensions}</dd>
              </div>
            </dl>
          </div>

          {isUpcoming && product.availableAt && (
            <div className="mt-8 rounded-[1.25rem] border border-smoke/70 bg-paper/90 p-6">
              <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-ash">
                Disponível em {formatDateTime(product.availableAt)}
              </p>
              <CountdownTimer targetDate={product.availableAt} />
            </div>
          )}

          <div className="mt-8 space-y-3">
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

          <div className="mt-6 border-t border-smoke/70 pt-6">
            <p className="mb-2 text-xs text-ash">Dúvidas sobre esta peça?</p>
            <WhatsAppButton productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
