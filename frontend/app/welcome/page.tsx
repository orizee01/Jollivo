import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/logo";

const floaters = [
  { emoji: "🍔", className: "left-[8%] top-[14%] text-6xl", r: "-12deg", delay: "0s" },
  { emoji: "🍕", className: "right-[10%] top-[10%] text-7xl", r: "14deg", delay: "0.6s" },
  { emoji: "🍣", className: "left-[14%] top-[40%] text-5xl", r: "8deg", delay: "1.2s" },
  { emoji: "🍩", className: "right-[12%] top-[36%] text-6xl", r: "-10deg", delay: "0.3s" },
  { emoji: "🌮", className: "left-[42%] top-[25%] text-5xl", r: "6deg", delay: "0.9s" },
];

export default function WelcomePage() {
  return (
    <main data-statusbar="light" className="relative flex min-h-(--app-h) flex-col overflow-hidden bg-brand-hero text-white">
      <div className="pointer-events-none absolute left-1/2 top-[26%] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      <div className="pointer-events-none absolute left-1/2 top-[26%] size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/5" />
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 size-72 rounded-full bg-yellow-300/30 blur-3xl" />

      <div className="relative flex-1">
        {floaters.map((f) => (
          <span
            key={f.emoji}
            className={`animate-floaty absolute drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] ${f.className}`}
            style={{ ["--r" as string]: f.r, animationDelay: f.delay }}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      <section className="animate-rise relative rounded-t-[40px] bg-white shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.25)] px-6 pb-[calc(2rem+var(--safe-bottom))] pt-8 text-ink">
        <div className="mx-auto mb-6 h-1.5 w-10 rounded-full bg-black/10" />
        <p className="flex items-center gap-2.5">
          <LogoMark className="size-9" />
          <Wordmark className="text-2xl text-brand" />
        </p>
        <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight">
          Your favourite food,
          <br />
          delivered hot.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Order from the best local restaurants and track your rider to your door — in minutes.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/sign-up" className="flex h-14 items-center justify-center rounded-2xl bg-brand text-[16px] font-bold text-white btn-glow transition active:scale-[0.98]">
            Create an account
          </Link>
          <Link href="/sign-in" className="flex h-14 items-center justify-center rounded-2xl border border-black/5 bg-canvas text-[16px] font-bold text-ink transition active:scale-[0.98]">
            I already have an account
          </Link>
          <Link href="/" className="mt-1 text-center text-sm font-semibold text-ink-soft">
            Browse as guest
          </Link>
        </div>
      </section>
    </main>
  );
}
