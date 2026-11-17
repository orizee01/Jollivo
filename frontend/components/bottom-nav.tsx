"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
import { BagIcon, HomeIcon, ReceiptIcon, UserIcon } from "./icons";

const tabs = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/orders", label: "Orders", Icon: ReceiptIcon },
  { href: "/cart", label: "Cart", Icon: BagIcon },
  { href: "/profile", label: "Profile", Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md bg-gradient-to-t from-canvas via-canvas/80 to-transparent px-4 pb-[calc(0.5rem+var(--safe-bottom))] pt-6">
      <ul className="pointer-events-auto flex items-center justify-between rounded-full border border-white/70 bg-white/80 p-1.5 shadow-[0_1px_2px_rgba(23,19,15,0.06),0_16px_32px_-12px_rgba(60,35,15,0.35)] backdrop-blur-xl">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex h-12 items-center gap-2 rounded-full text-sm font-bold transition-all duration-300 ${active ? "bg-ink px-5 text-white shadow-lg shadow-ink/30" : "px-4 text-ink-soft active:bg-canvas"}`}
              >
                <span className="relative">
                  <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
                  {href === "/cart" && count > 0 && (
                    <span className={`absolute -right-2.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] leading-[18px] text-white ring-2 ${active ? "ring-ink" : "ring-white"}`}>
                      {count}
                    </span>
                  )}
                </span>
                {active && <span>{label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
