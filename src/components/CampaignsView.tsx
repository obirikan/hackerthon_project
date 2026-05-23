"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCampaigns } from "@/lib/api";
import { getErrorMessage, resolveImageUrl } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ProductCard } from "@/components/ProductCard";
import type { CampaignSummary, Item } from "@/lib/types";
import { getItem } from "@/lib/api";

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[] | null>(null);
  const [featuredMap, setFeaturedMap] = useState<Record<string, Item[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    getCampaigns()
      .then(async (data) => {
        setCampaigns(data);
        const map: Record<string, Item[]> = {};
        await Promise.all(
          data.map(async (c) => {
            if (!c.featured_item_ids?.length) return;
            const items = await Promise.all(
              c.featured_item_ids.map((id) =>
                getItem(id).catch(() => null),
              ),
            );
            map[c.id] = items.filter((i): i is Item => i !== null);
          }),
        );
        setFeaturedMap(map);
      })
      .catch((e) => setError(getErrorMessage(e, "Could not load campaigns")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-16">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 bg-brand-navy-light" />
            <div className="aspect-[21/9] bg-brand-navy-light" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} retry={load} />;

  if (!campaigns?.length) {
    return (
      <EmptyState
        title="No active campaigns"
        description="Promotions from Mensah will appear here when they launch. Explore the full collection in the meantime."
        actionLabel="View collection"
        actionHref="/"
      />
    );
  }

  return (
    <div className="space-y-24">
      {campaigns.map((campaign, idx) => (
        <section
          key={campaign.id}
          className="campaign-block"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label mb-2">Promotion</p>
              <h2 className="font-display text-4xl text-brand-cream md:text-5xl">
                {campaign.title}
              </h2>
            </div>
            <Link
              href={`/campaigns/${campaign.id}`}
              className="text-[11px] uppercase tracking-[0.2em] text-brand-silver hover:text-brand-cream"
            >
              View details →
            </Link>
          </div>

          {campaign.copy_text && (
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-brand-silver/70">
              {campaign.copy_text}
            </p>
          )}

          {campaign.image_urls && campaign.image_urls.length > 0 && (
            <div className="mb-10 grid gap-4 md:grid-cols-2">
              {campaign.image_urls.map((url, i) => (
                <div
                  key={url}
                  className={`relative overflow-hidden bg-brand-navy-light ${
                    i === 0 && campaign.image_urls!.length === 1
                      ? "aspect-[21/9]"
                      : "aspect-[4/3]"
                  }`}
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

          {featuredMap[campaign.id]?.length > 0 && (
            <div>
              <p className="section-label mb-6">Featured pieces</p>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                {featuredMap[campaign.id].map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
