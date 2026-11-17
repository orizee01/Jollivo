"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/data";

const steps = ["Order placed", "Preparing", "On the way", "Delivered"];

// Simulated progress: advances one step roughly every 2 minutes after the order is placed.
function stepFor(placedAt: number, now: number) {
  return Math.min(steps.length - 1, Math.floor((now - placedAt) / 120_000));
}

export default function OrdersPage() {
  const { user } = useUser();
  const { orders } = useCart();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);

  const mine = orders.filter((o) => o.userId === user?.id);

  if (mine.length === 0) {
    return (
      <main className="flex min-h-[calc(var(--app-h)*0.8)] flex-col items-center justify-center px-8 text-center">
        <span className="animate-floaty text-8xl">🧾</span>
        <h1 className="mt-6 text-2xl font-extrabold">No orders yet</h1>
        <p className="mt-1 text-ink-soft">Your order history will appear here.</p>
        <Link href="/" className="mt-6 rounded-2xl bg-brand px-6 py-3.5 font-bold text-white btn-glow">
          Order something
        </Link>
      </main>
    );
  }

  const [latest, ...past] = mine;
  const step = stepFor(latest.placedAt, now);

  return (
    <main className="px-5 pt-[calc(1.25rem+var(--safe-top))]">
      <h1 className="text-[28px] font-extrabold tracking-tight">Orders</h1>

      <section className="animate-rise mt-5 bg-ink-hero overflow-hidden rounded-[28px] p-5 text-white shadow-xl shadow-ink/30">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">{step < 3 ? "Live order" : "Delivered"}</p>
            <p className="mt-1 text-xl font-extrabold">{latest.restaurantName}</p>
            <p className="text-sm text-white/60">#{latest.id} · {formatPrice(latest.total)}</p>
          </div>
          <span className={`text-5xl ${step < 3 ? "animate-floaty" : ""}`}>{step === 2 ? "🛵" : step === 3 ? "✅" : "👨‍🍳"}</span>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-1.5">
          {steps.map((s, i) => (
            <div key={s}>
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-white/15"}`} />
              <p className={`mt-1.5 text-[10px] font-bold ${i <= step ? "text-white" : "text-white/40"}`}>{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/60">Delivering to {latest.address}</p>
      </section>

      {past.length > 0 && (
        <>
          <h2 className="mb-3 mt-6 text-lg font-extrabold">Past orders</h2>
          <ul className="flex flex-col gap-3">
            {past.map((o) => (
              <li key={o.id} className="flex items-center gap-3 card rounded-3xl bg-white p-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-canvas text-2xl">{o.lines[0]?.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold">{o.restaurantName}</p>
                  <p className="text-xs text-ink-soft">
                    {new Date(o.placedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })} · {o.lines.reduce((n, l) => n + l.qty, 0)} items
                  </p>
                </div>
                <p className="font-extrabold">{formatPrice(o.total)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
