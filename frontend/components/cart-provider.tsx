"use client";

import { createContext, use, useCallback, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { MenuItem } from "@/lib/data";

export type CartLine = MenuItem & {
  qty: number;
  restaurantId: string;
  restaurantName: string;
};

export type Order = {
  id: string;
  userId: string;
  restaurantName: string;
  lines: CartLine[];
  total: number;
  address: string;
  placedAt: number;
};

type State = { lines: CartLine[]; orders: Order[] };

// --- A tiny localStorage-backed store, read with useSyncExternalStore ---------
const KEY = "feastly.state.v1";
const EMPTY: State = { lines: [], orders: [] };
let state: State | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as State) } : EMPTY;
  } catch {
    state = EMPTY;
  }
  return state;
}

function write(update: (s: State) => State) {
  state = update(read());
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — keep in memory only */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// -----------------------------------------------------------------------------

type CartContextValue = State & {
  count: number;
  subtotal: number;
  add: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  placeOrder: (order: Omit<Order, "id" | "placedAt">) => Order;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { lines, orders } = useSyncExternalStore(subscribe, read, () => EMPTY);

  const add = useCallback((item: MenuItem, restaurantId: string, restaurantName: string) => {
    write((s) => {
      // A cart holds items from one restaurant at a time, like most delivery apps.
      const base = s.lines.length && s.lines[0].restaurantId !== restaurantId ? [] : s.lines;
      const exists = base.some((l) => l.id === item.id);
      const lines = exists
        ? base.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...base, { ...item, qty: 1, restaurantId, restaurantName }];
      return { ...s, lines };
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    write((s) => ({
      ...s,
      lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
    }));
  }, []);

  const clear = useCallback(() => write((s) => ({ ...s, lines: [] })), []);

  const placeOrder = useCallback((order: Omit<Order, "id" | "placedAt">) => {
    const full: Order = { ...order, id: Math.random().toString(36).slice(2, 8).toUpperCase(), placedAt: Date.now() };
    write((s) => ({ lines: [], orders: [full, ...s.orders] }));
    return full;
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, orders, count, subtotal, add, setQty, clear, placeOrder };
  }, [lines, orders, add, setQty, clear, placeOrder]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = use(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
