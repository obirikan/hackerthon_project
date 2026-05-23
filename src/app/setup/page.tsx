import { MerchantShell } from "@/components/MerchantShell";
import { SetupForm } from "@/components/SetupForm";
import { TEAM_SLUG } from "@/lib/constants";

export default function SetupPage() {
  return (
    <MerchantShell>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="section-label mb-4">Hackathon</p>
        <h1 className="font-display text-4xl text-brand-cream md:text-5xl">
          Team registration
        </h1>
        <p className="mt-4 max-w-lg text-sm text-brand-silver/60">
          Register <strong className="text-brand-silver">{TEAM_SLUG}</strong> with the
          hackathon API. This slug is attached to every basket and campaign request.
        </p>
        <div className="mt-16">
          <SetupForm />
        </div>
      </div>
    </MerchantShell>
  );
}
