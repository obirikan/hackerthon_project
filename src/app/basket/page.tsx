import { MerchantShell } from "@/components/MerchantShell";
import { BasketView } from "@/components/BasketView";
import { getMerchant } from "@/lib/api";

export default async function BasketPage() {
  const merchant = await getMerchant();
  return (
    <MerchantShell>
      <BasketView merchant={merchant} />
    </MerchantShell>
  );
}
