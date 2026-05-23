export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-brand-navy-light" />
          <div className="mt-4 h-4 w-3/4 bg-brand-navy-light" />
          <div className="mt-2 h-3 w-1/2 bg-brand-navy-light" />
        </div>
      ))}
    </div>
  );
}
