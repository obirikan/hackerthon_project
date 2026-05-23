import { API_BASE } from "./constants";

/** Coerce API / storage values to a finite number */
export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function lineTotalMinor(unitMinor: unknown, qty: unknown): number {
  return toNumber(unitMinor) * Math.max(0, Math.floor(toNumber(qty, 1)));
}

export function formatPrice(minor: unknown, currency?: unknown): string {
  const amountMinor = toNumber(minor);
  const amount = amountMinor / 100;
  const code =
    typeof currency === "string" && /^[A-Z]{3}$/i.test(currency)
      ? currency.toUpperCase()
      : "GHS";

  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `GH₵ ${amount.toFixed(2)}`;
  }
}

export function resolveImageUrl(path: string | undefined): string {
  if (!path) return "/placeholder-product.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappDigits(number: string): string {
  return number.replace(/\D/g, "");
}

export function buildWhatsAppUrl(
  phone: string,
  basketId: string,
  merchantName: string,
): string {
  const text = encodeURIComponent(
    `Hello ${merchantName}! I'd like to complete my order.\n\nBasket ID: ${basketId}\n\nPlease confirm availability and payment details. Thank you!`,
  );
  return `https://wa.me/${whatsappDigits(phone)}?text=${text}`;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  return fallback;
}
