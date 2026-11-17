import { LogoMark, Wordmark } from "./logo";

// Opening screen shown while the app loads. It is plain HTML and CSS (see
// "Splash" in globals.css), so it appears with the very first paint and fades
// itself out without waiting for any JavaScript.
export function Splash() {
  return (
    <div className="splash bg-brand-hero" aria-hidden="true">
      <div className="splash-ring" />
      <LogoMark tone="cream" className="splash-mark size-24 drop-shadow-[0_18px_30px_rgba(40,0,10,0.45)]" />
      <Wordmark className="splash-word mt-5 text-[44px] leading-none text-white" />
      <p className="splash-tag mt-2 text-sm font-semibold tracking-wide text-white/80">Good food, happily delivered</p>
      <div className="splash-bar"><span /></div>
    </div>
  );
}
