import { SITE_CONFIG } from "@/lib/mock-data";
import { getWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  productName?: string;
  variant?: "floating" | "inline";
  className?: string;
}

export function WhatsAppButton({
  message = SITE_CONFIG.whatsappMessage,
  productName,
  variant = "inline",
  className,
}: WhatsAppButtonProps) {
  const url = getWhatsAppUrl(SITE_CONFIG.whatsapp, message, productName);

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-ink text-paper rounded-full flex items-center justify-center shadow-lg hover:bg-charcoal transition-colors duration-300 ${className ?? ""}`}
      >
        <MessageCircle size={24} />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-sm tracking-wide hover:opacity-70 transition-opacity duration-300 ${className ?? ""}`}
    >
      <MessageCircle size={18} />
      WhatsApp
    </a>
  );
}
