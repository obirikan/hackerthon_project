import type { Basket, BasketLine, Item } from "./types";
import { lineTotalMinor, toNumber } from "./format";

export function normalizeItem(raw: unknown): Item | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : "";
  const name = typeof o.name === "string" ? o.name : "";
  if (!id || !name) return null;

  const image_urls = Array.isArray(o.image_urls)
    ? (o.image_urls as unknown[]).filter((u): u is string => typeof u === "string")
    : typeof o.image_url === "string"
      ? [o.image_url]
      : [];

  return {
    id,
    merchant_id: typeof o.merchant_id === "string" ? o.merchant_id : "",
    name,
    description: typeof o.description === "string" ? o.description : undefined,
    price_minor: toNumber(o.price_minor),
    currency: typeof o.currency === "string" ? o.currency : "GHS",
    image_urls,
    in_stock: o.in_stock !== false,
  };
}

export function normalizeBasketLine(raw: unknown): BasketLine | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const item_id = typeof o.item_id === "string" ? o.item_id : "";
  if (!item_id) return null;

  const qty = Math.max(1, toNumber(o.qty, 1));
  const price_minor = toNumber(o.price_minor ?? o.unit_price_minor);
  const line_total_minor =
    toNumber(o.line_total_minor) || lineTotalMinor(price_minor, qty);

  return {
    item_id,
    name: typeof o.name === "string" ? o.name : "Item",
    qty,
    price_minor,
    line_total_minor,
    currency: typeof o.currency === "string" ? o.currency : "GHS",
    image_url:
      typeof o.image_url === "string"
        ? o.image_url
        : Array.isArray(o.image_urls) && typeof o.image_urls[0] === "string"
          ? o.image_urls[0]
          : undefined,
    in_stock: o.in_stock !== false,
  };
}

export function normalizeBasket(raw: unknown): Basket {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const items = (Array.isArray(o.items) ? o.items : [])
    .map(normalizeBasketLine)
    .filter((line): line is BasketLine => line !== null);

  const currency =
    typeof o.currency === "string"
      ? o.currency
      : items[0]?.currency ?? "GHS";

  const total_minor =
    toNumber(o.total_minor) ||
    items.reduce((sum, line) => sum + line.line_total_minor, 0);

  const merchant =
    o.merchant && typeof o.merchant === "object"
      ? (o.merchant as Basket["merchant"])
      : undefined;

  return {
    id: typeof o.id === "string" ? o.id : "",
    merchant_id:
      typeof o.merchant_id === "string"
        ? o.merchant_id
        : merchant?.id ?? "",
    items,
    total_minor,
    currency,
    customer_name:
      typeof o.customer_name === "string" ? o.customer_name : undefined,
    customer_phone:
      typeof o.customer_phone === "string" ? o.customer_phone : undefined,
    customer_note:
      typeof o.customer_note === "string" ? o.customer_note : undefined,
    merchant,
  };
}
