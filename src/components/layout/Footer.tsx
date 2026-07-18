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
    <footer className="mt-auto border-t border-smoke/80 bg-gradient-to-br from-paper via-mist/40 to-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-xl uppercase tracking-[0.15em]">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-[10px] uppercase tracking-[0.35em] text-ash">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-opacity duration-300 hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.35em] text-ash">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
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
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
                >
                  <Instagram size={16} />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-smoke/80 pt-8 text-xs text-ash md:flex-row">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.</p>
          <p>Peças artesanais únicas — cada uma com história própria.</p>
        </div>
      </div>
    </footer>
  );
}
