import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionLabel = "Browse collection",
  actionHref = "/",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-3xl text-brand-cream">{title}</p>
      <p className="mt-3 max-w-sm text-sm text-brand-silver/60">{description}</p>
      <Link href={actionHref} className="btn-primary mt-8">
        {actionLabel}
      </Link>
    </div>
  );
}
