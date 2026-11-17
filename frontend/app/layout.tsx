import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/cart-provider";
import { Splash } from "@/components/splash";
import { hasClerkKeys } from "@/lib/clerk";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jollivo — Food delivered fast",
  description: "Order from the best local restaurants and get it delivered in minutes.",
  appleWebApp: { capable: true, title: "Jollivo", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#b8182f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const app = (
    <CartProvider>
      <div className="app-stage">
        <div className="app-frame">
          {/* Status bar, Dynamic Island and home indicator only show on larger screens (see globals.css). */}
          <div className="app-statusbar" aria-hidden="true">
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8 .5 10.2 10.2 0 0 0 .8 3.4L2 4.6a8.5 8.5 0 0 1 6-2.4zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.8 6.8 0 0 0 8 3.9a6.8 6.8 0 0 0-4.8 1.9L4.4 7c1-.9 2.2-1.4 3.6-1.4zM8 9a1.6 1.6 0 0 0-1.2.5L8 11.5l1.2-2A1.6 1.6 0 0 0 8 9z" /></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" /><path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4" /></svg>
            </span>
          </div>
          <div className="app-island" aria-hidden="true" />
          <div className="app-screen">{children}</div>
          <Splash />
          <div className="app-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </CartProvider>
  );

  // Without keys, Clerk can't start. The login/sign-up screens still render in
  // preview mode, and the app pages show setup steps (see app/(main)/layout.tsx).
  if (!hasClerkKeys) {
    return (
      <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
        <body className="min-h-full">{app}</body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* With Cache Components, ClerkProvider goes inside <body>. */}
        <ClerkProvider
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: "#b8182f",
              colorForeground: "#2b0d10",
              colorMutedForeground: "#8f7a6c",
              colorBackground: "#ffffff",
              colorInput: "#fbf6ea",
              borderRadius: "14px",
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            },
            elements: {
              cardBox: "shadow-none border-0 w-full",
              card: "shadow-none bg-transparent px-0",
              header: "hidden",
              formButtonPrimary: "h-12 text-[15px] font-semibold normal-case shadow-none",
              socialButtonsBlockButton: "h-12 border-black/10",
              formFieldInput: "h-12 border-black/5",
              footer: "bg-transparent",
            },
          }}
        >
          {app}
        </ClerkProvider>
      </body>
    </html>
  );
}
