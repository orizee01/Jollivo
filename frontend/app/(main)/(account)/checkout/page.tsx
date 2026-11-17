"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/components/cart-provider";
import { BackIcon, CheckIcon, PinIcon } from "@/components/icons";
import { formatPrice, getRestaurant } from "@/lib/data";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { lines, subtotal, placeOrder } = useCart();
  const [address, setAddress] = useState("12 Admiralty Way, Lekki, Lagos");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  const restaurant = lines[0] ? getRestaurant(lines[0].restaurantId) : undefined;
  const total = subtotal + (restaurant?.fee ?? 0) + subtotal * 0.05;

  if (lines.length === 0) {
    return (
      <main className="flex min-h-[calc(var(--app-h)*0.8)] flex-col items-center justify-center px-8 text-center">
        <p className="text-6xl">🧾</p>
        <p className="mt-4 text-xl font-extrabold">Nothing to check out</p>
        <Link href="/" className="mt-4 font-bold text-brand">Browse restaurants</Link>
      </main>
    );
  }

  function submit() {
    if (!user || !address.trim()) return;
    setPlacing(true);
    placeOrder({ userId: user.id, restaurantName: lines[0].restaurantName, lines, total, address: address.trim() });
    router.push("/orders");
  }

  return (
    <main className="px-5 pt-[calc(1rem+var(--safe-top))]">
      <div className="flex items-center gap-3">
        <Link href="/cart" aria-label="Back" className="card grid size-11 place-items-center rounded-full bg-white"><BackIcon className="size-5" /></Link>
        <h1 className="text-2xl font-extrabold tracking-tight">Checkout</h1>
      </div>

      <section className="mt-6 card rounded-3xl bg-white p-5">
        <h2 className="flex items-center gap-2 font-extrabold"><PinIcon className="size-5 text-brand" /> Delivery address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="mt-3 w-full resize-none rounded-2xl bg-canvas p-3.5 text-[15px] font-medium outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note for the rider (optional)"
          className="mt-2 w-full rounded-2xl bg-canvas p-3.5 text-[15px] font-medium outline-none placeholder:text-ink-soft focus:ring-2 focus:ring-brand"
        />
      </section>

      <section className="mt-4 card rounded-3xl bg-white p-5">
        <h2 className="font-extrabold">Payment</h2>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-brand bg-brand-soft p-3.5">
          <span className="text-2xl">💵</span>
          <div className="flex-1">
            <p className="font-bold">Pay on delivery</p>
            <p className="text-xs text-ink-soft">Cash or transfer to your rider</p>
          </div>
          <span className="grid size-6 place-items-center rounded-full bg-brand text-white"><CheckIcon className="size-4" /></span>
        </div>
      </section>

      <section className="mt-4 card rounded-3xl bg-white p-5">
        <h2 className="font-extrabold">Order summary</h2>
        <ul className="mt-2 text-[15px]">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between py-1">
              <span className="text-ink-soft"><span className="font-bold text-ink">{l.qty}×</span> {l.name}</span>
              <span className="font-semibold">{formatPrice(l.qty * l.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-dashed border-black/10 pt-3 text-lg font-extrabold">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </section>

      <button
        onClick={submit}
        disabled={placing || !address.trim()}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-brand text-[16px] font-bold text-white btn-glow transition active:scale-[0.98] disabled:opacity-60"
      >
        {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
      </button>
    </main>
  );
}
