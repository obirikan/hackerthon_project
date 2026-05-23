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
    <header className="sticky top-0 z-50 border-b border-brand-silver/15 bg-brand-navy/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="group shrink-0 rounded-sm bg-brand-cream px-3 py-2 transition hover:bg-white sm:px-4 sm:py-2.5"
        >
          <div className="relative h-7 w-[132px] sm:h-8 sm:w-[152px] md:h-9 md:w-[172px]">
            <Image
              src={BRAND_LOGO_URL}
              alt={BRAND_NAME}
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 132px, 172px"
              priority
            />
          </div>
        </Link>

        <nav className="flex items-center gap-6 md:gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] text-brand-silver/80 transition hover:text-brand-cream"
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
