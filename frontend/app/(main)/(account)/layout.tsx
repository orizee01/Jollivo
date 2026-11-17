import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";

// These pages always wait for the login check on the server, so they can't be
// part of an instantly-prefetched shell. Opting out stops Next.js's dev-time
// "instant navigation" validation from reporting the sign-in redirect as an error.
export const instant = false;

// Checkout, Orders and Profile require an account. proxy.ts already redirects
// signed-out visitors to /sign-in; this is a second check next to the pages.
async function RequireAuth({ children }: { children: React.ReactNode }) {
  await auth.protect();
  return <>{children}</>;
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[calc(var(--app-h)*0.8)] place-items-center">
          <span className="size-9 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        </div>
      }
    >
      <RequireAuth>{children}</RequireAuth>
    </Suspense>
  );
}
