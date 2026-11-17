"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "@/components/cart-provider";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { formatPrice, getRestaurant } from "@/lib/data";

export default function CartPage() {
  const { lines, subtotal, setQty, clear } = useCart();
  const { isSignedIn } = useAuth();
  const restaurant = lines[0] ? getRestaurant(lines[0].restaurantId) : undefined;
  const fee = restaurant?.fee ?? 0;
  const service = subtotal * 0.05;
  const total = subtotal + fee + service;

  if (lines.length === 0) {
    return (
      <main className="flex min-h-[calc(var(--app-h)*0.8)] flex-col items-center justify-center px-8 text-center">
        <span className="animate-floaty text-8xl">🛍️</span>
        <h1 className="mt-6 text-2xl font-extrabold">Your cart is empty</h1>
        <p className="mt-1 text-ink-soft">Add something delicious to get started.</p>
        <Link href="/" className="mt-6 rounded-2xl bg-brand px-6 py-3.5 font-bold text-white btn-glow">
          Browse restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="px-5 pt-[calc(1.25rem+var(--safe-top))]">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold tracking-tight">My cart</h1>
        <button onClick={clear} className="text-sm font-bold text-brand">Clear</button>
      </div>
      <p className="text-sm text-ink-soft">From {lines[0].restaurantName}</p>

      <ul className="mt-5 flex flex-col gap-3">
        {lines.map((l) => (
          <li key={l.id} className="flex items-center gap-3 card rounded-3xl bg-white p-3">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-soft to-amber-100 text-4xl">{l.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{l.name}</p>
              <p className="font-extrabold text-brand">{formatPrice(l.price * l.qty)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-canvas p-1">
              <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease" className="grid size-8 place-items-center rounded-full bg-white active:scale-90"><MinusIcon className="size-4" /></button>
              <span className="w-4 text-center text-sm font-extrabold">{l.qty}</span>
              <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase" className="grid size-8 place-items-center rounded-full bg-brand text-white active:scale-90"><PlusIcon className="size-4" /></button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 card rounded-3xl bg-white p-5 text-[15px]">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        <Row label="Delivery" value={fee === 0 ? "Free" : formatPrice(fee)} />
        <Row label="Service fee" value={formatPrice(service)} />
        <div className="my-3 border-t border-dashed border-black/10" />
        <Row label="Total" value={formatPrice(total)} bold />
      </div>

      <Link
        href={isSignedIn ? "/checkout" : "/sign-in?redirect_url=/checkout"}
        className="mt-5 flex h-14 items-center justify-center rounded-2xl bg-brand text-[16px] font-bold text-white btn-glow transition active:scale-[0.98]"
      >
        {isSignedIn ? "Go to checkout" : "Log in to checkout"}
      </Link>
    </main>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? "text-lg font-extrabold" : "text-ink-soft"}`}>
      <span>{label}</span>
      <span className={bold ? "" : "font-semibold text-ink"}>{value}</span>
    </div>
  );
}
