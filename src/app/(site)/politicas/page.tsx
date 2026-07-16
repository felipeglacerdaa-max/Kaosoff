import { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Políticas",
  description:
    "Políticas de envio, trocas, devoluções e formas de pagamento da Kaosoff.",
};

const SECTIONS = [
  {
    title: "Envio",
    content: [
      "Enviamos para todo o Brasil via Correios (PAC e SEDEX) ou transportadora parceira.",
      "O prazo de envio é de 3 a 10 dias úteis após a confirmação do pagamento, para peças de pronta entrega.",
      "Encomendas personalizadas seguem prazo acordado no momento da solicitação.",
      "O valor do frete é calculado no checkout com base no CEP de destino.",
      "Todas as peças são embaladas com cuidado para proteger o artesanal no transporte.",
    ],
  },
  {
    title: "Trocas e devoluções",
    content: [
      "Por se tratarem de peças artesanais únicas, não realizamos trocas por outro item.",
      "Em caso de defeito de fabricação ou dano no transporte, entre em contato em até 7 dias após o recebimento com fotos do problema.",
      "Analisaremos cada caso individualmente e buscaremos a melhor solução — reparo, reposição quando possível, ou reembolso.",
      "Devoluções por arrependimento não se aplicam a peças personalizadas/encomendadas.",
    ],
  },
  {
    title: "Formas de pagamento",
    content: [
      "Pix — pagamento instantâneo, com desconto quando aplicável.",
      "Cartão de crédito — parcelamento em até 3x sem juros.",
      "Boleto bancário — disponível em breve.",
      "",
      "A integração com gateway de pagamento (Mercado Pago, Stripe ou Pagar.me) será ativada em produção. Os pagamentos mockados no ambiente de desenvolvimento não representam transações reais.",
    ],
  },
];

export default function PoliticasPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <SectionHeading title="Políticas" />

      <div className="space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-lg tracking-wide mb-6">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.content.map((paragraph, i) =>
                paragraph ? (
                  <p key={i} className="text-sm text-ash leading-relaxed">
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
