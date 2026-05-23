import { API_BASE } from "./constants";

export function formatPrice(minor: number, currency: string): string {
  const amount = minor / 100;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
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
