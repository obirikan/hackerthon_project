"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BRAND_LOGO_URL, BRAND_NAME } from "@/lib/constants";

const links = [
  { href: "/", label: "Collection" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/basket", label: "Basket" },
];

export function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-silver/20 bg-brand-navy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="relative h-11 w-11 transition group-hover:opacity-90 sm:h-12 sm:w-12">
            <Image
              src={BRAND_LOGO_URL}
              alt={BRAND_NAME}
              fill
              className="object-contain"
              sizes="48px"
              priority
            />
          </div>
          <span className="hidden font-display text-lg tracking-wide text-brand-cream sm:block">
            {BRAND_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] text-brand-cream/70 transition hover:text-brand-silver"
            >
              {link.label}
              {link.href === "/basket" && count > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-silver px-1 text-[9px] font-medium text-brand-navy">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
