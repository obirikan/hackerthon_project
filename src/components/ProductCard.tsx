"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, resolveImageUrl } from "@/lib/format";
import type { Item } from "@/lib/types";

export function ProductCard({
  item,
  featured = false,
}: {
  item: Item;
  featured?: boolean;
}) {
  const image = resolveImageUrl(item.image_urls?.[0]);

  return (
    <article
      className={`product-card group relative ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <Link href={`/products/${item.id}`} className="block">
        <div
          className={`relative overflow-hidden bg-brand-navy-light ${
            featured ? "aspect-[3/4] md:aspect-[4/5]" : "aspect-[3/4]"
          }`}
        >
          <Image
            src={image}
            alt={item.name}
            fill
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 50vw, 25vw"
            }
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-60" />
          {!item.in_stock && (
            <span className="absolute left-3 top-3 bg-brand-navy/90 px-2.5 py-1 text-[10px] uppercase tracking-widest text-brand-silver ring-1 ring-brand-silver/30">
              Sold out
            </span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-tight text-brand-cream transition group-hover:text-brand-silver">
              {item.name}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-brand-silver/50">
              {item.description}
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm text-brand-silver">
            {formatPrice(item.price_minor, item.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
