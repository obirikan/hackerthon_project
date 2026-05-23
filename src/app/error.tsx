"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-navy px-6 text-center">
      <p className="font-display text-3xl text-brand-cream">Something went wrong</p>
      <p className="mt-4 max-w-md text-sm text-brand-silver/60">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-8 flex gap-4">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
