"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { normalizeItem } from "./normalize";
import type { Item } from "./types";

export interface CartEntry {
  item: Item;
  qty: number;
}

interface CartContextValue {
  entries: CartEntry[];
  count: number;
  hydrated: boolean;
  addItem: (item: Item, qty?: number) => void;
  removeItem: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "sylvara-cart-v2";

function parseStoredCart(raw: string): CartEntry[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const entries: CartEntry[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const item = normalizeItem(o.item);
      const qty = Math.max(1, Math.floor(Number(o.qty) || 1));
      if (item && Number.isFinite(item.price_minor)) {
        entries.push({ item, qty });
      }
    }
    return entries;
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setEntries(parseStoredCart(raw));
    else {
      const legacy = localStorage.getItem("sylvara-cart-v1");
      if (legacy) {
        setEntries(parseStoredCart(legacy));
        localStorage.removeItem("sylvara-cart-v1");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  const addItem = useCallback((item: Item, qty = 1) => {
    if (!item.in_stock) return;
    const safeQty = Math.max(1, Math.floor(qty));
    setEntries((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing) {
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, qty: e.qty + safeQty, item } : e,
        );
      }
      return [...prev, { item, qty: safeQty }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setEntries((prev) => prev.filter((e) => e.item.id !== itemId));
  }, []);

  const setQty = useCallback((itemId: string, qty: number) => {
    if (qty < 1) {
      setEntries((prev) => prev.filter((e) => e.item.id !== itemId));
      return;
    }
    setEntries((prev) =>
      prev.map((e) =>
        e.item.id === itemId ? { ...e, qty: Math.floor(qty) } : e,
      ),
    );
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const count = useMemo(
    () => entries.reduce((sum, e) => sum + e.qty, 0),
    [entries],
  );

  const value = useMemo(
    () => ({
      entries,
      count,
      hydrated,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [entries, count, hydrated, addItem, removeItem, setQty, clear],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
