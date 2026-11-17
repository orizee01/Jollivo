import Link from "next/link";
import type { ReactNode } from "react";
import { BackIcon } from "@/components/icons";

export function AuthShell({ title, subtitle, emoji, children }: { title: string; subtitle: string; emoji: string; children: ReactNode }) {
  return (
    <main data-statusbar="light" className="flex min-h-(--app-h) flex-col bg-white">
      <header className="relative overflow-hidden bg-brand-hero px-6 pb-14 pt-[calc(1rem+var(--safe-top))] text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 left-10 size-40 rounded-full bg-yellow-300/25 blur-2xl" />
        <Link href="/welcome" aria-label="Back" className="relative grid size-10 place-items-center rounded-full bg-white/20 backdrop-blur">
          <BackIcon className="size-5" />
        </Link>
        <div className="relative mt-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-1 text-[15px] text-white/85">{subtitle}</p>
          </div>
          <span className="animate-floaty text-6xl drop-shadow-lg">{emoji}</span>
        </div>
      </header>
      <section className="animate-rise relative -mt-8 flex-1 rounded-t-[32px] bg-white px-5 pb-10 pt-6">
        {children}
      </section>
    </main>
  );
}
