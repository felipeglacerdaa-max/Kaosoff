import { Metadata } from "next";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sobre",
  description: SITE_CONFIG.aboutText,
};

const PROCESS_STEPS = [
  {
    title: "Concepção",
    text: "Cada peça começa com um esboço, uma ideia ou um pedido. Não há produção em massa — cada criação nasce de um momento.",
  },
  {
    title: "Produção",
    text: "Mãos, argila, fios e paciência. O processo artesanal é lento e intencional, respeitando o tempo de cada material.",
  },
  {
    title: "Acabamento",
    text: "Detalhes finais, revisão e embalagem cuidadosa. A peça só sai quando está pronta para encontrar quem a escolheu.",
  },
];

export default function SobrePage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeading title="Sobre a Kaosoff" />

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="space-y-6 text-sm text-ash leading-relaxed">
            <p>{SITE_CONFIG.aboutText}</p>
            <p>
              Trabalhamos com cerâmica, crochê, macramê, chapéus, balaclavas e
              amigurumi — sempre em peças únicas ou em drops com tiragem
              limitada. Quando uma peça é vendida, ela sai de circulação.
            </p>
            <p>
              Acreditamos que o artesanal é um ato de resistência: contra a
              padronização, a pressa e o descartável. Cada ponto, cada argila,
              cada nó carrega a marca de quem fez.
            </p>
          </div>

          <div className="relative aspect-[3/4] bg-mist overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop&q=80"
              alt="Bastidores da produção artesanal Kaosoff"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <section className="mt-24 md:mt-32">
          <h2 className="font-display text-xl tracking-wide mb-12">
            Processo criativo
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title}>
                <span className="text-[10px] tracking-widest uppercase text-ash">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg tracking-wide mt-2">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-ash leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            "1610701596007-d2b4aeba5243",
            "1582793829649-cc2b25d6b3e6",
            "1578746923794-7f5f977781b4",
          ].map((id) => (
            <div key={id} className="relative aspect-square bg-mist overflow-hidden">
              <Image
                src={`https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80`}
                alt="Bastidores Kaosoff"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
