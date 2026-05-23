import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MerchantShell } from "@/components/MerchantShell";
import { ProductCard } from "@/components/ProductCard";
import { getCampaign } from "@/lib/api";
import { resolveImageUrl } from "@/lib/format";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let campaign;
  try {
    campaign = await getCampaign(id);
  } catch {
    notFound();
  }

  return (
    <MerchantShell>
      <article className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Link
          href="/campaigns"
          className="mb-10 inline-block text-[11px] uppercase tracking-[0.2em] text-brand-silver/60 hover:text-brand-cream"
        >
          ← All campaigns
        </Link>
        <p className="section-label mb-4">Campaign</p>
        <h1 className="font-display text-4xl text-brand-cream md:text-6xl">
          {campaign.title}
        </h1>
        {campaign.copy_text && (
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-brand-silver/70">
            {campaign.copy_text}
          </p>
        )}
        {campaign.image_urls && campaign.image_urls.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {campaign.image_urls.map((url) => (
              <div
                key={url}
                className="relative aspect-[4/3] overflow-hidden bg-brand-navy-light"
              >
                <Image
                  src={resolveImageUrl(url)}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
        {campaign.featured_items && campaign.featured_items.length > 0 && (
          <div className="mt-20">
            <p className="section-label mb-8">Featured pieces</p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {campaign.featured_items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </article>
    </MerchantShell>
  );
}
