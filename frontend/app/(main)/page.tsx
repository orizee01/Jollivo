"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useUser } from "@clerk/nextjs";
import { categories, formatPrice, restaurants } from "@/lib/data";
import { BellIcon, BikeIcon, ChevronIcon, ClockIcon, HeartIcon, PinIcon, SearchIcon, SlidersIcon, StarIcon } from "@/components/icons";

// The clock is only read in the browser. The server snapshot is a fixed "Hello",
// because reading the time while prerendering is rejected by Next.js.
const noopSubscribe = () => () => {};
function clockGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
function useGreeting() {
  return useSyncExternalStore(noopSubscribe, clockGreeting, () => "Hello");
}

export default function HomePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const greeting = useGreeting();
  // Favourites are a visual toggle for now; they reset when the page reloads.
  const [liked, setLiked] = useState<string[]>([]);
  const toggleLike = (id: string) => setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter(
      (r) =>
        (category === "all" || r.category === category) &&
        (!q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.menu.some((m) => m.name.toLowerCase().includes(q))),
    );
  }, [query, category]);

  return (
    <main>
      {/* Header */}
      <header className="relative overflow-hidden px-5 pb-2 pt-[calc(1rem+var(--safe-top))]">
        <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-10 size-56 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <button className="flex items-center gap-2.5 text-left">
            <span className="card grid size-11 place-items-center rounded-full bg-white">
              <PinIcon className="size-5 text-brand" />
            </span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft">Deliver to</span>
              <span className="flex items-center gap-0.5 text-[15px] font-extrabold">
                12 Admiralty Way, Lekki <ChevronIcon className="size-4 rotate-90 text-ink-soft" />
              </span>
            </span>
          </button>
          {isLoaded && !isSignedIn ? (
            <Link href="/sign-in" className="btn-glow rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white">
              Log in
            </Link>
          ) : (
            <button aria-label="Notifications" className="card relative grid size-11 place-items-center rounded-full bg-white">
              <BellIcon className="size-5" />
              <span className="absolute right-3 top-3 size-2 rounded-full bg-brand ring-2 ring-white" />
            </button>
          )}
        </div>

        <h1 className="relative mt-6 text-[30px] font-extrabold leading-[1.12] tracking-tight">
          {greeting}
          {isSignedIn && user?.firstName ? `, ${user.firstName}` : ""} 👋
          <br />
          <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">What are you craving?</span>
        </h1>

        <div className="relative mt-5 flex gap-2.5">
          <label className="card flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 transition focus-within:ring-2 focus-within:ring-brand/40">
            <SearchIcon className="size-5 shrink-0 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes or restaurants"
              className="w-full min-w-0 bg-transparent text-[16px] font-medium outline-none placeholder:text-ink-soft"
            />
          </label>
          <button aria-label="Filters" className="btn-glow grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-white transition active:scale-95">
            <SlidersIcon className="size-5" />
          </button>
        </div>
      </header>

      {/* Categories */}
      <section className="no-scrollbar flex gap-2.5 overflow-x-auto px-5 py-5">
        {categories.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-bold transition active:scale-95 ${active ? "bg-ink text-white shadow-lg shadow-ink/25" : "card bg-white text-ink"}`}
            >
              <span className={`grid size-9 place-items-center rounded-full text-xl ${active ? "bg-white/15" : "bg-canvas"}`}>{c.emoji}</span>
              {c.name}
            </button>
          );
        })}
      </section>

      {/* Promo */}
      {!query && category === "all" && (
        <section className="px-5">
          <div className="bg-brand-hero relative overflow-hidden rounded-[28px] p-5 text-white shadow-xl shadow-brand/35">
            <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full border-[18px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-16 right-10 size-40 rounded-full border-[14px] border-white/10" />
            <span className="relative inline-block rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur">Limited time</span>
            <p className="relative mt-3 text-[28px] font-extrabold leading-[1.05] tracking-tight">
              50% off your
              <br />
              first order
            </p>
            <p className="relative mt-3 flex items-center gap-2 text-sm font-medium text-white/85">
              Use code
              <span className="rounded-lg border border-dashed border-white/60 bg-white/15 px-2 py-0.5 font-extrabold tracking-wider text-white">JOLLI50</span>
            </p>
            <span className="animate-floaty absolute bottom-3 right-4 text-[84px] leading-none drop-shadow-[0_14px_18px_rgba(0,0,0,0.3)]">🍱</span>
          </div>
        </section>
      )}

      {/* Restaurants */}
      <section className="px-5 pt-7">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight">{query ? "Results" : "Popular near you"}</h2>
            <p className="text-sm font-medium text-ink-soft">{results.length} {results.length === 1 ? "place" : "places"} delivering now</p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="card rounded-3xl bg-white p-8 text-center">
            <p className="text-4xl">🤷</p>
            <p className="mt-2 font-bold">Nothing matches “{query}”</p>
            <p className="text-sm text-ink-soft">Try another dish or cuisine.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {results.map((r, i) => {
              const isLiked = liked.includes(r.id);
              return (
                <li key={r.id} className="animate-rise relative" style={{ animationDelay: `${i * 60}ms` }}>
                  <Link href={`/restaurant/${r.id}`} className="card block overflow-hidden rounded-[28px] bg-white p-2 transition active:scale-[0.98]">
                    <div className={`tile-shine relative grid h-40 place-items-center overflow-hidden rounded-[22px] bg-gradient-to-br ${r.gradient}`}>
                      <span aria-hidden="true" className="absolute -bottom-10 -right-6 text-[150px] leading-none opacity-20 blur-[2px]">{r.emoji}</span>
                      <span className="relative text-[84px] leading-none drop-shadow-[0_14px_18px_rgba(0,0,0,0.3)]">{r.emoji}</span>
                      {r.tag && <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-ink shadow-sm">{r.tag}</span>}
                      <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                        <ClockIcon className="size-3.5" /> {r.time}
                      </span>
                    </div>
                    <div className="px-3 pb-3 pt-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-[17px] font-extrabold tracking-tight">{r.name}</h3>
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2 py-1 text-[13px] font-extrabold text-ink">
                          <StarIcon className="size-3.5 text-gold" /> {r.rating}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-ink-soft">{r.cuisine}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold">
                        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 ${r.fee === 0 ? "bg-emerald-50 text-emerald-700" : "bg-canvas text-ink"}`}>
                          <BikeIcon className="size-4" />
                          {r.fee === 0 ? "Free delivery" : `${formatPrice(r.fee)} delivery`}
                        </span>
                        <span className="text-ink-soft">{r.reviews > 999 ? `${(r.reviews / 1000).toFixed(1)}k` : r.reviews} reviews</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleLike(r.id)}
                    aria-label={isLiked ? `Remove ${r.name} from favourites` : `Add ${r.name} to favourites`}
                    aria-pressed={isLiked}
                    className={`absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full shadow-md backdrop-blur-md transition active:scale-90 ${isLiked ? "bg-white text-red-500" : "bg-white/90 text-ink"}`}
                  >
                    <HeartIcon className="size-5" fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
