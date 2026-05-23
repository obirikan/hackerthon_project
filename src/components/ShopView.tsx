"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/lib/api";
import { getErrorMessage } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingGrid } from "@/components/LoadingGrid";
import { ProductCard } from "@/components/ProductCard";
import type { Item } from "@/lib/types";

export function ShopView() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    getItems()
      .then(setItems)
      .catch((e) => setError(getErrorMessage(e, "Could not load the collection")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingGrid />;
  if (error) return <ErrorState message={error} retry={load} />;
  if (!items?.length) {
    return (
      <EmptyState
        title="Collection empty"
        description="No pieces are listed right now. Check back soon."
      />
    );
  }

  const [hero, ...rest] = items;

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
      {hero && <ProductCard item={hero} featured key={hero.id} />}
      {rest.map((item, i) => (
        <div
          key={item.id}
          style={{ animationDelay: `${(i + 1) * 60}ms` } as React.CSSProperties}
        >
          <ProductCard item={item} />
        </div>
      ))}
    </div>
  );
}
