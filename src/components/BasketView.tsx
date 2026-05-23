"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createBasket, getBasket } from "@/lib/api";
import { MERCHANT_SLUG, TEAM_SLUG } from "@/lib/constants";
import { useCart } from "@/lib/cart";
import {
  buildWhatsAppUrl,
  formatPrice,
  getErrorMessage,
  lineTotalMinor,
  resolveImageUrl,
} from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";
import { LoadingGrid } from "@/components/LoadingGrid";
import type { Basket, Merchant } from "@/lib/types";

export function BasketView({ merchant }: { merchant: Merchant }) {
  const { entries, count, hydrated, setQty, removeItem, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [basket, setBasket] = useState<Basket | null>(null);

  const inStockEntries = useMemo(
    () => entries.filter((e) => e.item.in_stock),
    [entries],
  );
  const hasUnavailable = entries.some((e) => !e.item.in_stock);

  const displaySubtotal = useMemo(
    () =>
      entries.reduce(
        (sum, e) => sum + lineTotalMinor(e.item.price_minor, e.qty),
        0,
      ),
    [entries],
  );

  const checkoutSubtotal = useMemo(
    () =>
      inStockEntries.reduce(
        (sum, e) => sum + lineTotalMinor(e.item.price_minor, e.qty),
        0,
      ),
    [inStockEntries],
  );

  const currency =
    entries[0]?.item.currency ??
    basket?.currency ??
    "GHS";

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!entries.length) {
      setError("Your basket is empty.");
      return;
    }

    if (!inStockEntries.length) {
      setError(
        "Every item in your basket is sold out. Remove them or wait for a restock.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const { id } = await createBasket({
        merchant_id: merchant.id,
        items: inStockEntries.map((e) => ({
          item_id: e.item.id,
          qty: e.qty,
        })),
        team_slug: TEAM_SLUG,
        customer_name: name.trim() || undefined,
        customer_phone: phone.trim() || undefined,
        customer_note: note.trim() || undefined,
      });

      const detail = await getBasket(id);
      if (!detail.items.length) {
        throw new Error("Basket was created but returned no line items.");
      }
      setBasket(detail);
      clear();
    } catch (err) {
      setError(getErrorMessage(err, "Checkout failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <LoadingGrid count={2} />
      </div>
    );
  }

  if (basket) {
    const waNumber =
      basket.merchant?.whatsapp_number || merchant.whatsapp_number;
    const wa = waNumber
      ? buildWhatsAppUrl(
          waNumber,
          basket.id,
          basket.merchant?.name ?? merchant.name,
        )
      : null;

    return (
      <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
        <p className="section-label mb-4">Order confirmed</p>
        <h1 className="font-display text-4xl text-brand-cream">Basket ready</h1>
        <p className="mt-4 text-sm text-brand-silver/70">
          Basket ID:{" "}
          <span className="font-mono text-brand-silver">{basket.id}</span>
        </p>

        {basket.items.length === 0 ? (
          <p className="mt-8 text-sm text-amber-200/90">
            No line items were returned. Share your basket ID with the merchant.
          </p>
        ) : (
          <ul className="mt-10 space-y-6 border-t border-brand-silver/15 pt-10">
            {basket.items.map((line) => (
              <li key={line.item_id} className="flex gap-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-brand-navy-light">
                  <Image
                    src={resolveImageUrl(line.image_url)}
                    alt={line.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 justify-between gap-4">
                  <div>
                    <p className="text-sm text-brand-cream">{line.name}</p>
                    <p className="text-xs text-brand-silver/50">
                      Qty {line.qty}
                      {line.in_stock === false && " · Sold out"}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-brand-silver">
                    {formatPrice(line.line_total_minor, line.currency)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex justify-between border-t border-brand-silver/15 pt-6">
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand-silver/60">
            Total
          </span>
          <span className="font-mono text-lg text-brand-cream">
            {formatPrice(basket.total_minor, basket.currency)}
          </span>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Complete on WhatsApp
            </a>
          ) : (
            <p className="text-sm text-brand-silver/60">
              WhatsApp number unavailable. Share basket ID{" "}
              <span className="font-mono">{basket.id}</span> with the merchant.
            </p>
          )}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-ghost"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <EmptyState
        title="Your basket is empty"
        description="Add tailoring pieces from the collection, then check out via WhatsApp."
        actionLabel="Browse collection"
        actionHref="/"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <p className="section-label mb-4">Checkout</p>
      <h1 className="font-display text-4xl text-brand-cream md:text-5xl">
        Your basket
      </h1>

      {hasUnavailable && (
        <div
          className="mt-6 border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90"
          role="status"
        >
          Some items are sold out and will not be included at checkout. Remove
          them or wait for restock.
        </div>
      )}

      {!inStockEntries.length && entries.length > 0 && (
        <div
          className="mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200/90"
          role="alert"
        >
          All items in your basket are currently sold out. Checkout is disabled
          until at least one piece is in stock.
        </div>
      )}

      <div className="mt-12 grid gap-16 lg:grid-cols-5">
        <ul className="space-y-8 lg:col-span-3">
          {entries.map(({ item, qty }) => {
            const lineTotal = lineTotalMinor(item.price_minor, qty);
            return (
              <li
                key={item.id}
                className="flex gap-5 border-b border-brand-silver/10 pb-8"
              >
                <Link
                  href={`/products/${item.id}`}
                  className="relative h-28 w-20 shrink-0 overflow-hidden bg-brand-navy-light"
                >
                  <Image
                    src={resolveImageUrl(item.image_urls?.[0])}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.id}`}
                      className="font-display text-xl text-brand-cream hover:text-brand-silver"
                    >
                      {item.name}
                    </Link>
                    {!item.in_stock && (
                      <p className="mt-1 text-xs uppercase tracking-widest text-amber-400/80">
                        Sold out
                      </p>
                    )}
                    <p className="mt-1 font-mono text-sm text-brand-silver">
                      {formatPrice(item.price_minor, item.currency)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-brand-silver/20">
                      <button
                        type="button"
                        onClick={() => setQty(item.id, qty - 1)}
                        className="px-3 py-1.5 text-brand-silver hover:text-brand-cream"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => item.in_stock && setQty(item.id, qty + 1)}
                        disabled={!item.in_stock}
                        className="px-3 py-1.5 text-brand-silver hover:text-brand-cream disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] uppercase tracking-widest text-brand-silver/50 hover:text-brand-silver"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="hidden font-mono text-sm text-brand-silver sm:block">
                  {formatPrice(lineTotal, item.currency)}
                </p>
              </li>
            );
          })}
        </ul>

        <form onSubmit={handleCheckout} className="lg:col-span-2">
          <div className="sticky top-28 space-y-6 border border-brand-silver/15 p-6 md:p-8">
            <div className="flex justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-brand-silver/60">
                {inStockEntries.length < entries.length
                  ? "Checkout subtotal"
                  : "Subtotal"}
              </span>
              <span className="font-mono text-lg text-brand-cream">
                {formatPrice(
                  inStockEntries.length < entries.length
                    ? checkoutSubtotal
                    : displaySubtotal,
                  currency,
                )}
              </span>
            </div>

            {inStockEntries.length < entries.length && (
              <p className="text-xs text-brand-silver/50">
                Basket total (all items):{" "}
                {formatPrice(displaySubtotal, currency)}
              </p>
            )}

            <p className="text-xs text-brand-silver/50">
              {inStockEntries.length} of {entries.length} item(s) available for
              checkout
            </p>

            <div className="space-y-4 pt-4">
              <input
                className="input-field"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                className="input-field"
                placeholder="Phone (WhatsApp)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <textarea
                className="input-field min-h-[80px] resize-none"
                placeholder="Note for tailor (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-300/90" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !inStockEntries.length}
              className="btn-primary w-full"
            >
              {submitting ? "Creating basket…" : "Review & checkout"}
            </button>
            <p className="text-center text-[10px] text-brand-silver/40">
              Team {TEAM_SLUG} · {MERCHANT_SLUG}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
