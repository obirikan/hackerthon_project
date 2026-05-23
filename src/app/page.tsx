import Image from "next/image";
import Link from "next/link";
import { MerchantShell } from "@/components/MerchantShell";
import { ShopView } from "@/components/ShopView";
import { getItems, getMerchant } from "@/lib/api";
import { resolveImageUrl } from "@/lib/format";

export default async function HomePage() {
  const merchant = await getMerchant();
  let featuredImage: string | undefined;
  try {
    const items = await getItems();
    featuredImage = resolveImageUrl(items[0]?.image_urls?.[0]);
  } catch {
    featuredImage = undefined;
  }

  return (
    <MerchantShell>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-12">
          <div className="flex flex-col justify-end px-5 py-16 md:px-8 md:py-24 lg:col-span-5 lg:py-32">
            <p className="section-label mb-6">Spring / Summer</p>
            <h1 className="hero-title font-display text-brand-cream">
              Tailored
              <br />
              <span className="italic text-brand-silver">for the</span>
              <br />
              modern man
            </h1>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-brand-silver/70">
              {merchant.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#collection" className="btn-primary">
                Shop collection
              </a>
              <Link href="/campaigns" className="btn-ghost">
                Campaigns
              </Link>
            </div>
          </div>
          {featuredImage && (
            <div className="relative min-h-[50vh] lg:col-span-7 lg:min-h-[70vh]">
              <Image
                src={featuredImage}
                alt="Featured tailoring"
                fill
                className="object-cover object-top"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/40 to-transparent lg:w-1/3" />
            </div>
          )}
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label mb-3">Inventory</p>
            <h2 className="font-display text-4xl text-brand-cream md:text-5xl">
              The collection
            </h2>
          </div>
          <p className="max-w-xs text-xs text-brand-silver/50">
            All prices from live inventory. Sold-out pieces remain visible — restocks arrive via WhatsApp.
          </p>
        </div>
        <ShopView />
      </section>
    </MerchantShell>
  );
}
