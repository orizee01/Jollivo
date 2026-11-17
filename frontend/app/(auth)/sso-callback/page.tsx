import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// Google sends people back here after they pick an account; Clerk finishes the
// sign-in and then redirects home.
export default function SsoCallbackPage() {
  return (
    <main className="grid min-h-(--app-h) place-items-center bg-white text-ink-soft">
      <p className="animate-pulse text-[15px] font-semibold">Signing you in…</p>
      <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
      <div id="clerk-captcha" />
    </main>
  );
}
