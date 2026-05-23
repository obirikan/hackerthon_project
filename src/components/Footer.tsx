import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO_URL, BRAND_NAME, TEAM_SLUG } from "@/lib/constants";
import type { Merchant } from "@/lib/types";

export function Footer({ merchant }: { merchant: Merchant }) {
  return (
    <footer className="border-t border-brand-silver/15 px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src={BRAND_LOGO_URL}
                alt={BRAND_NAME}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <p className="font-display text-xl text-brand-cream">{BRAND_NAME}</p>
          </div>
          <p className="mt-2 max-w-sm text-sm text-brand-silver/50">
            {merchant.description}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] text-brand-silver/60 md:text-right">
          <Link href="/admin/campaigns" className="hover:text-brand-cream">
            Create campaign
          </Link>
          <Link href="/setup" className="hover:text-brand-cream">
            Team setup
          </Link>
          <p>
            Hackathon · Team <span className="text-brand-silver">{TEAM_SLUG}</span>
          </p>
          <p className="normal-case tracking-normal text-brand-silver/40">
            AI Fashion Retail · CODED
          </p>
        </div>
      </div>
    </footer>
  );
}
