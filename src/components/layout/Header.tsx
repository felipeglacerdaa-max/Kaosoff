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
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-smoke">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="font-display text-xl md:text-2xl tracking-[0.15em] uppercase hover:opacity-70 transition-opacity"
        >
          {SITE_CONFIG.name}
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase hover:opacity-70 transition-opacity duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-paper z-30 transition-transform duration-300",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col px-8 py-10 gap-6" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-2xl tracking-wide hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
