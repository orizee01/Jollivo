import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasClerkKeys = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

// Checkout, Orders and Profile require an account. Signed-out visitors are sent to
// /sign-in here, before the page renders, and brought back afterwards. (Redirecting
// from inside the page render instead trips Next.js's instant-navigation validation.)
// app/(main)/(account)/layout.tsx repeats the check as a second line of defence.
const accountPaths = ["/checkout", "/orders", "/profile"];
const isAccountRoute = (pathname: string) => accountPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

// Until keys are added, pass through so the app can show its setup screen instead
// of crashing.
export default hasClerkKeys
  ? clerkMiddleware(async (auth, req) => {
      if (isAccountRoute(req.nextUrl.pathname)) await auth.protect();
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
