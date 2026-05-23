import Link from "next/link";
import { MerchantShell } from "@/components/MerchantShell";
import { CampaignsView } from "@/components/CampaignsView";

export default function CampaignsPage() {
  return (
    <MerchantShell>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="section-label mb-4">Editorial</p>
        <h1 className="font-display text-4xl text-brand-cream md:text-6xl">
          Campaigns
        </h1>
        <p className="mt-4 max-w-lg text-sm text-brand-silver/60">
          Active promotions and featured looks from Phasion Sense.
        </p>
        <Link
          href="/admin/campaigns"
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] text-brand-silver/60 hover:text-brand-cream"
        >
          Admin: create campaign →
        </Link>
        <div className="mt-16">
          <CampaignsView />
        </div>
      </div>
    </MerchantShell>
  );
}
