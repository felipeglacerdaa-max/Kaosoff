export interface ShippingQuote {
  service: "PAC" | "SEDEX";
  amount: number;
  deadline: number;
  originZip: string;
  destinationZip: string;
}

const ORIGIN_ZIP = process.env.CORREIOS_ORIGIN_ZIP || "32600-000";

function normalizeZip(zip: string): string {
  return zip.replace(/\D/g, "");
}

function formatZip(zip: string): string {
  const digits = normalizeZip(zip);
  if (digits.length !== 8) return zip;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function parseMoney(value: string | undefined): number {
  if (!value) return 0;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return Number(normalized || 0);
}

export function getFallbackShippingQuote(destinationZip: string, productPrice: number): ShippingQuote {
  const digits = normalizeZip(destinationZip);
  const isMinas = digits.startsWith("30") || digits.startsWith("31") || digits.startsWith("32") || digits.startsWith("33") || digits.startsWith("34") || digits.startsWith("35") || digits.startsWith("36") || digits.startsWith("37") || digits.startsWith("38") || digits.startsWith("39");
  const base = isMinas ? 18.9 : digits.startsWith("4") || digits.startsWith("5") || digits.startsWith("6") || digits.startsWith("7") ? 26.5 : 31.5;

  const amount = Number(Math.max(18.9, Math.min(79.9, base + (productPrice > 400 ? 10 : 0))).toFixed(2));
  return {
    service: "PAC",
    amount,
    deadline: isMinas ? 5 : 7,
    originZip: formatZip(ORIGIN_ZIP),
    destinationZip: formatZip(destinationZip),
  };
}

async function fetchCorreiosQuote(serviceCode: string, destinationZip: string, productPrice: number): Promise<ShippingQuote | null> {
  const origin = normalizeZip(ORIGIN_ZIP);
  const destination = normalizeZip(destinationZip);
  if (origin.length !== 8 || destination.length !== 8) {
    return null;
  }

  const declaredValue = Math.max(0, productPrice);
  const url = new URL("https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx");
  url.searchParams.set("nCdEmpresa", "");
  url.searchParams.set("sDsSenha", "");
  url.searchParams.set("sCepOrigem", origin);
  url.searchParams.set("sCepDestino", destination);
  url.searchParams.set("nVlPeso", "0.5");
  url.searchParams.set("nCdFormato", "1");
  url.searchParams.set("nVlComprimento", "20");
  url.searchParams.set("nVlAltura", "15");
  url.searchParams.set("nVlLargura", "10");
  url.searchParams.set("nCdServico", serviceCode);
  url.searchParams.set("nVlDiametro", "0");
  url.searchParams.set("sCdMaoPropria", "n");
  url.searchParams.set("sCdAvisoRecebimento", "n");
  url.searchParams.set("nVlValorDeclarado", String(declaredValue));
  url.searchParams.set("StrRetorno", "xml");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1400);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/xml,text/xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const xml = await response.text();
    const valueMatch = xml.match(/<Valor>([^<]+)<\/Valor>/i);
    const deadlineMatch = xml.match(/<PrazoEntrega>([^<]+)<\/PrazoEntrega>/i);
    if (!valueMatch) {
      return null;
    }

    return {
      service: serviceCode === "40010" ? "SEDEX" : "PAC",
      amount: Number(parseMoney(valueMatch[1]).toFixed(2)),
      deadline: Number(deadlineMatch?.[1] || 0),
      originZip: formatZip(ORIGIN_ZIP),
      destinationZip: formatZip(destinationZip),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function calculateShippingQuote(destinationZip: string, productPrice: number): Promise<ShippingQuote> {
  try {
    const [pacResult, sedexResult] = await Promise.allSettled([
      fetchCorreiosQuote("41106", destinationZip, productPrice),
      fetchCorreiosQuote("40010", destinationZip, productPrice),
    ]);

    const quotes = [pacResult.status === "fulfilled" ? pacResult.value : null, sedexResult.status === "fulfilled" ? sedexResult.value : null].filter(
      (quote): quote is ShippingQuote => Boolean(quote)
    );
    if (quotes.length > 0) {
      return quotes.reduce((lowest, quote) => (quote.amount < lowest.amount ? quote : lowest), quotes[0]);
    }
  } catch {
    // fallback silencioso
  }

  return getFallbackShippingQuote(destinationZip, productPrice);
}
