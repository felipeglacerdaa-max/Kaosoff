"use client";

import { useState, FormEvent } from "react";
import { Instagram, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/mock-data";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function ContatoPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST /api/contact — integrar com serviço de e-mail (Resend, SendGrid)
    setSent(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <SectionHeading
            title="Contato"
            subtitle="Estamos aqui para tirar dúvidas, receber encomendas e conversar sobre peças."
          />

          <div className="space-y-6 mt-8">
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
            >
              <Mail size={18} />
              {SITE_CONFIG.email}
            </a>

            <WhatsAppButton />

            <a
              href={SITE_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
            >
              <Instagram size={18} />
              @kaosoff
            </a>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="bg-mist p-8 text-sm">
              <p>Mensagem enviada! Responderemos em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input name="nome" label="Nome" required />
              <Input name="email" label="E-mail" type="email" required />
              <Textarea name="mensagem" label="Mensagem" required />
              <Button type="submit">Enviar mensagem</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
