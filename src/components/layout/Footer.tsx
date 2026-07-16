import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/mock-data";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const FOOTER_LINKS = {
  Loja: [
    { href: "/produtos", label: "Produtos" },
    { href: "/drops", label: "Drops" },
    { href: "/encomendas", label: "Encomendas" },
  ],
  Marca: [
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
    { href: "/politicas", label: "Políticas" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-smoke mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-display text-xl tracking-[0.15em] uppercase"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 text-sm text-ash leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[10px] tracking-widest uppercase text-ash mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[10px] tracking-widest uppercase text-ash mb-4">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <Mail size={16} />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <WhatsAppButton />
              </li>
              <li>
                <a
                  href={SITE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <Instagram size={16} />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-smoke flex flex-col md:flex-row justify-between gap-4 text-xs text-ash">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.</p>
          <p>Peças artesanais únicas — cada uma com história própria.</p>
        </div>
      </div>
    </footer>
  );
}
