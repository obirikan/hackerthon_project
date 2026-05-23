import Link from "next/link";
import { MerchantShell } from "@/components/MerchantShell";
import { CampaignCreateForm } from "@/components/CampaignCreateForm";

export default function AdminCampaignsPage() {
  return (
    <MerchantShell>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Link
          href="/campaigns"
          className="mb-10 inline-block text-[11px] uppercase tracking-[0.2em] text-brand-silver/60 hover:text-brand-cream"
        >
          ← Public campaigns
        </Link>
        <p className="section-label mb-4">Admin</p>
        <h1 className="font-display text-4xl text-brand-cream md:text-5xl">
          Create campaign
        </h1>
        <p className="mt-4 max-w-lg text-sm text-brand-silver/60">
          Publish a promotion to the storefront. Campaigns appear on the public
          campaigns page for your team slug.
        </p>
        <div className="mt-16">
          <CampaignCreateForm />
        </div>
      </div>
    </MerchantShell>
  );
}
