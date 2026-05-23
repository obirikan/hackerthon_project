import { getMerchant } from "@/lib/api";
import { BRAND_NAME } from "@/lib/constants";
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
  const primary = merchant.brand_colors?.[0] ?? "#1C1C3C";
  const accent = merchant.brand_colors?.[1] ?? "#C0C0C0";

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
          text={`${BRAND_NAME} — Sharp tailoring · Accra · WhatsApp checkout`}
        />
        <main className="flex-1">{children}</main>
        <Footer merchant={merchant} />
      </CartProvider>
    </div>
  );
}
