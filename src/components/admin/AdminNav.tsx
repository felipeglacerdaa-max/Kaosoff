"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ClipboardList,
  CreditCard,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/drops", label: "Drops", icon: Layers },
  { href: "/admin/encomendas", label: "Encomendas", icon: ClipboardList },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-smoke bg-mist/50">
      <div className="p-6 md:p-8">
        <Link
          href="/admin"
          className="font-display text-lg tracking-[0.15em] uppercase"
        >
          Kaosoff
        </Link>
        <p className="text-[10px] tracking-widest uppercase text-ash mt-1">
          Admin
        </p>
      </div>

      <nav className="px-4 pb-4 md:pb-8 flex md:flex-col gap-1 overflow-x-auto">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm whitespace-nowrap transition-colors",
              pathname === href
                ? "bg-ink text-paper"
                : "text-ash hover:text-ink hover:bg-paper"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 pb-6 md:pb-8 space-y-1 border-t border-smoke pt-4 mx-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-ash hover:text-ink transition-colors"
        >
          <ExternalLink size={16} />
          Ver loja
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-ash hover:text-ink transition-colors w-full"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
