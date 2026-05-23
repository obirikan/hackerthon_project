"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getItem } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatPrice, resolveImageUrl } from "@/lib/format";
import { ErrorState } from "@/components/ErrorState";
import type { Item } from "@/lib/types";

export function ProductDetail({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const load = () => {
    setLoading(true);
    setError(null);
    getItem(itemId)
      .then(setItem)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [itemId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-12 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-[3/4] bg-brand-navy-light" />
          <div className="space-y-4">
            <div className="h-12 w-2/3 bg-brand-navy-light" />
            <div className="h-6 w-1/4 bg-brand-navy-light" />
            <div className="h-24 w-full bg-brand-navy-light" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return <ErrorState message={error ?? "Product not found"} retry={load} />;
  }

  const product = item;
  const images = product.image_urls?.length
    ? product.image_urls
    : ["/placeholder-product.svg"];

  function handleAdd() {
    if (!product.in_stock) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
      <Link
        href="/"
        className="mb-10 inline-block text-[11px] uppercase tracking-[0.2em] text-brand-silver/60 hover:text-brand-cream"
      >
        ← Collection
      </Link>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-navy-light">
          <Image
            src={resolveImageUrl(images[0])}
            alt={product.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/60">
              <span className="border border-brand-silver/40 px-6 py-3 text-sm uppercase tracking-[0.3em] text-brand-silver">
                Sold out
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="section-label mb-4">Piece</p>
          <h1 className="font-display text-4xl leading-tight text-brand-cream md:text-5xl lg:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 font-mono text-xl text-brand-silver">
            {formatPrice(product.price_minor, product.currency)}
          </p>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-brand-silver/70">
            {product.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center border border-brand-silver/20">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-brand-silver hover:text-brand-cream"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                disabled={!product.in_stock}
                className="px-4 py-2.5 text-brand-silver hover:text-brand-cream disabled:opacity-30"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!item.in_stock}
              className="btn-primary min-w-[200px]"
            >
              {added ? "Added ✓" : product.in_stock ? "Add to basket" : "Unavailable"}
            </button>

            <Link href="/basket" className="btn-ghost">
              View basket
            </Link>
          </div>

          <p className="mt-8 text-xs text-brand-silver/40">
            {product.in_stock
              ? "Checkout via WhatsApp after reviewing your basket."
              : "This piece is currently unavailable. Browse the collection for in-stock tailoring."}
          </p>
        </div>
      </div>
    </div>
  );
}
