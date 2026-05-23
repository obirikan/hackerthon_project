export function Marquee({ text }: { text: string }) {
  const repeated = `${text} · `.repeat(8);
  return (
    <div className="marquee-track border-y border-brand-silver/20 bg-brand-navy py-3 overflow-hidden">
      <div className="marquee-inner flex whitespace-nowrap">
        <span className="marquee-text text-[11px] uppercase tracking-[0.35em] text-brand-silver/70">
          {repeated}
        </span>
        <span
          className="marquee-text text-[11px] uppercase tracking-[0.35em] text-brand-silver/70"
          aria-hidden
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
