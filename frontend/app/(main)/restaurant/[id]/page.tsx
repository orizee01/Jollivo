import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { formatPrice, getRestaurant, restaurants } from "@/lib/data";
import { BackIcon, BikeIcon, ClockIcon, StarIcon } from "@/components/icons";
import { AddToCart, CartBar } from "./add-to-cart";

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: r.id }));
}

// The route's `id` is read inside <Suspense> so Next.js can show the skeleton
// instantly on navigation and stream the restaurant in.
export default function RestaurantPage({ params }: PageProps<"/restaurant/[id]">) {
  return (
    <Suspense fallback={<RestaurantSkeleton />}>
      <Restaurant params={params} />
    </Suspense>
  );
}

function RestaurantSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading restaurant">
      <div className="h-72 animate-pulse bg-gradient-to-br from-brand-soft to-amber-100" />
      <section className="relative z-10 -mt-8 rounded-t-[32px] bg-canvas px-5">
        <div className="card h-40 -translate-y-10 animate-pulse rounded-[28px] bg-white" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card h-28 animate-pulse rounded-3xl bg-white" />
          ))}
        </div>
      </section>
    </main>
  );
}

async function Restaurant({ params }: { params: PageProps<"/restaurant/[id]">["params"] }) {
  const { id } = await params;
  const r = getRestaurant(id);
  if (!r) notFound();

  return (
    <main>
      <div data-statusbar="light" className={`tile-shine relative grid h-72 place-items-center overflow-hidden bg-gradient-to-br ${r.gradient}`}>
        <span aria-hidden="true" className="absolute -bottom-16 -right-10 text-[240px] leading-none opacity-20 blur-[3px]">{r.emoji}</span>
        <Link href="/" aria-label="Back" className="absolute left-4 top-[calc(1rem+var(--safe-top))] z-10 grid size-11 place-items-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition active:scale-90">
          <BackIcon className="size-5" />
        </Link>
        <span className="animate-floaty relative -mt-4 text-[120px] leading-none drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]">{r.emoji}</span>
      </div>

      <section className="relative z-10 -mt-8 rounded-t-[32px] bg-canvas px-5">
        <div className="card -translate-y-10 rounded-[28px] bg-white p-5">
          <h1 className="text-2xl font-extrabold tracking-tight">{r.name}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{r.cuisine}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center [&>div]:rounded-2xl [&>div]:bg-canvas [&>div]:py-3">
            <div>
              <p className="flex items-center justify-center gap-1 font-extrabold"><StarIcon className="size-4 text-gold" />{r.rating}</p>
              <p className="text-[11px] font-semibold text-ink-soft">{r.reviews} reviews</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-extrabold"><ClockIcon className="size-4 text-brand" />{r.time.split(" ")[0]}</p>
              <p className="text-[11px] font-semibold text-ink-soft">minutes</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-extrabold"><BikeIcon className="size-4 text-brand" />{r.fee === 0 ? "Free" : formatPrice(r.fee)}</p>
              <p className="text-[11px] font-semibold text-ink-soft">delivery</p>
            </div>
          </div>
        </div>

        <h2 className="-mt-4 mb-3 text-[22px] font-extrabold tracking-tight">Menu</h2>
        <ul className="flex flex-col gap-3 pb-20">
          {r.menu.map((item) => (
            <li key={item.id} className="card flex items-center gap-4 rounded-3xl bg-white p-2.5 pr-4">
              <span className="grid size-[88px] shrink-0 place-items-center rounded-[20px] bg-gradient-to-br from-brand-soft to-amber-100 text-5xl drop-shadow-sm">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                {item.popular && <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand">🔥 Popular</span>}
                <h3 className="font-bold leading-snug">{item.name}</h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">{item.description}</p>
                <p className="mt-1 font-extrabold">{formatPrice(item.price)}</p>
              </div>
              <AddToCart item={item} restaurantId={r.id} restaurantName={r.name} />
            </li>
          ))}
        </ul>
      </section>

      <CartBar />
    </main>
  );
}
