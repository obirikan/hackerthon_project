"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Item } from "./types";

export interface CartEntry {
  item: Item;
  qty: number;
}

interface CartContextValue {
  entries: CartEntry[];
  count: number;
  addItem: (item: Item, qty?: number) => void;
  removeItem: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "sylvara-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as CartEntry[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  const addItem = useCallback((item: Item, qty = 1) => {
    if (!item.in_stock) return;
    setEntries((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing) {
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, qty: e.qty + qty } : e,
        );
      }
      return [...prev, { item, qty }];
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
      prev.map((e) => (e.item.id === itemId ? { ...e, qty } : e)),
    );
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const count = useMemo(
    () => entries.reduce((sum, e) => sum + e.qty, 0),
    [entries],
  );

  const value = useMemo(
    () => ({ entries, count, addItem, removeItem, setQty, clear }),
    [entries, count, addItem, removeItem, setQty, clear],
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
