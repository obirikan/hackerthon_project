import Link from "next/link";

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-2xl text-brand-cream">Something went wrong</p>
      <p className="mt-3 max-w-md text-sm text-brand-silver/60">{message}</p>
      <div className="mt-8 flex gap-4">
        {retry && (
          <button
            type="button"
            onClick={retry}
            className="btn-primary"
          >
            Try again
          </button>
        )}
        <Link href="/" className="btn-ghost">
          Back to shop
        </Link>
      </div>
    </div>
  );
}
