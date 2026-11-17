"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { formatPrice, type MenuItem } from "@/lib/data";

export function AddToCart({ item, restaurantId, restaurantName }: { item: MenuItem; restaurantId: string; restaurantName: string }) {
  const { lines, add, setQty } = useCart();
  const qty = lines.find((l) => l.id === item.id)?.qty ?? 0;

  if (qty === 0) {
    return (
      <button
        onClick={() => add(item, restaurantId, restaurantName)}
        aria-label={`Add ${item.name}`}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white btn-glow transition active:scale-90"
      >
        <PlusIcon className="size-5" />
      </button>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1 rounded-full bg-brand-soft p-1">
      <button onClick={() => add(item, restaurantId, restaurantName)} aria-label="Increase" className="grid size-8 place-items-center rounded-full bg-brand text-white active:scale-90">
        <PlusIcon className="size-4" />
      </button>
      <span className="text-sm font-extrabold text-brand">{qty}</span>
      <button onClick={() => setQty(item.id, qty - 1)} aria-label="Decrease" className="grid size-8 place-items-center rounded-full bg-white text-brand active:scale-90">
        <MinusIcon className="size-4" />
      </button>
    </div>
  );
}

export function CartBar() {
  const { count, subtotal } = useCart();
  if (count === 0) return null;
  return (
    <div className="animate-rise fixed inset-x-0 bottom-[calc(5.25rem+var(--safe-bottom))] z-40 mx-auto max-w-md px-4">
      <Link href="/cart" className="flex h-14 items-center justify-between bg-ink-hero rounded-full pl-2.5 pr-6 text-white shadow-2xl shadow-ink/40 transition active:scale-[0.98]">
        <span className="flex items-center gap-3 font-bold">
          <span className="btn-glow grid size-9 place-items-center rounded-full bg-brand text-sm">{count}</span>
          View cart
        </span>
        <span className="font-extrabold">{formatPrice(subtotal)}</span>
      </Link>
    </div>
  );
}
