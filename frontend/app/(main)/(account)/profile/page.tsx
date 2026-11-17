"use client";

import Link from "next/link";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/components/cart-provider";
import { ChevronIcon } from "@/components/icons";

export default function ProfilePage() {
  const { user } = useUser();
  const { orders } = useCart();
  const count = orders.filter((o) => o.userId === user?.id).length;

  const items = [
    { emoji: "🧾", label: "My orders", href: "/orders" },
    { emoji: "📍", label: "Saved addresses", href: "#" },
    { emoji: "💳", label: "Payment methods", href: "#" },
    { emoji: "🎁", label: "Promotions", href: "#" },
    { emoji: "💬", label: "Help & support", href: "#" },
  ];

  return (
    <main>
      <header data-statusbar="light" className="relative overflow-hidden rounded-b-[40px] bg-brand-hero px-5 shadow-xl shadow-brand/25 pb-8 pt-[calc(1.25rem+var(--safe-top))] text-white">
        <div className="pointer-events-none absolute -right-12 -top-12 size-52 rounded-full bg-white/10" />
        <h1 className="relative text-[28px] font-extrabold tracking-tight">Profile</h1>
        <div className="relative mt-5 flex items-center gap-4">
          <div className="rounded-full ring-4 ring-white/30">
            <UserButton appearance={{ elements: { avatarBox: "size-16" } }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-extrabold">{user?.fullName || user?.username || "Jollivo member"}</p>
            <p className="truncate text-sm text-white/80">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat value={String(count)} label="Orders" />
          <Stat value="0" label="Favourites" />
          <Stat value="JOLLI50" label="Promo" />
        </div>
      </header>

      <ul className="mx-5 mt-6 overflow-hidden card rounded-3xl bg-white">
        {items.map((it) => (
          <li key={it.label} className="border-b border-black/5 last:border-0">
            <Link href={it.href} className="flex items-center gap-4 px-4 py-4 active:bg-canvas">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-soft to-amber-100 text-xl">{it.emoji}</span>
              <span className="flex-1 font-bold">{it.label}</span>
              <ChevronIcon className="size-5 text-ink-soft" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mx-5 mt-4">
        <SignOutButton redirectUrl="/welcome">
          <button className="card h-14 w-full rounded-2xl bg-white font-bold text-red-500 active:bg-red-50">Log out</button>
        </SignOutButton>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 py-3 backdrop-blur">
      <p className="truncate px-1 text-lg font-extrabold">{value}</p>
      <p className="text-[11px] font-semibold text-white/80">{label}</p>
    </div>
  );
}
