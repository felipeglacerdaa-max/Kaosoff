"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.error || "Credenciais inválidas.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-mist">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-display text-2xl tracking-[0.15em] uppercase">
            Kaosoff
          </h1>
          <p className="text-[10px] tracking-widest uppercase text-ash mt-2">
            Painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-paper p-8 border border-smoke">
          <Input
            name="email"
            label="E-mail"
            type="email"
            required
            defaultValue="email de adm"
          />
          <Input name="password" label="Senha" type="password" required />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-[10px] text-ash text-center leading-relaxed">
            Credenciais mock para desenvolvimento.
            {/* TODO: Substituir por autenticação real (NextAuth, Clerk) */}
          </p>
        </form>
      </div>
    </div>
  );
}
