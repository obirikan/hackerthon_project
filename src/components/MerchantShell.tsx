import { getMerchant } from "@/lib/api";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Marquee } from "@/components/Marquee";
import { Footer } from "@/components/Footer";

export async function MerchantShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const merchant = await getMerchant();
  const primary = merchant.brand_colors?.[0] ?? "#0a0a0a";
  const accent = merchant.brand_colors?.[1] ?? "#ff8c00";

  return (
    <div
      style={
        {
          "--brand-navy": primary,
          "--brand-silver": accent,
        } as React.CSSProperties
      }
    >
      <div className="grain" aria-hidden />
      <CartProvider>
        <Header />
        <Marquee
          text={`${BRAND_NAME} — ${BRAND_TAGLINE} · Ghana · WhatsApp checkout`}
        />
        <main className="flex-1">{children}</main>
        <Footer merchant={merchant} />
      </CartProvider>
    </div>
  );
}
