"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/produtos", label: "Produtos" },
  { href: "/drops", label: "Drops" },
  { href: "/encomendas", label: "Encomendas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-smoke/80 bg-paper/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(20,17,15,0.03)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-mist text-[10px] font-semibold uppercase tracking-[0.3em]">
            K
          </span>
          <span className="font-display text-lg tracking-[0.2em] uppercase md:text-xl">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[10px] uppercase tracking-[0.35em] transition-opacity duration-300 hover:opacity-70 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:scale-x-0 after:bg-ink after:transition-transform hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full border border-ink/15 bg-ink px-3 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-paper transition-opacity hover:opacity-80"
          >
            Admin
          </Link>
        </nav>

        <button
          className="-mr-2 rounded-full p-2 transition-colors hover:bg-mist md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-16 z-30 bg-paper/95 transition-transform duration-300 md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-6 px-8 py-10" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-2xl tracking-wide transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="inline-flex w-fit items-center rounded-full border border-ink/15 bg-ink px-4 py-2 text-sm font-medium uppercase tracking-[0.3em] text-paper transition-opacity hover:opacity-80"
          >
            Ir para o Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
