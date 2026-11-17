// The Jollivo logo: a lowercase "j" whose dot is gold.
// tone="cherry" is the app icon (cherry tile, cream letter); tone="cream" is for
// use on top of cherry backgrounds (cream tile, cherry letter).
export function LogoMark({ tone = "cherry", className }: { tone?: "cherry" | "cream"; className?: string }) {
  const tile = tone === "cherry" ? "url(#jollivo-tile)" : "#fbf6ea";
  const letter = tone === "cherry" ? "#fbf6ea" : "#b8182f";
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Jollivo" className={className}>
      <defs>
        <linearGradient id="jollivo-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cf2440" />
          <stop offset="1" stopColor="#7d0e22" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={tile} />
      <path className="logo-letter" d="M37 26v15a11 11 0 0 1-11 11h-3" fill="none" stroke={letter} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="logo-dot" cx="37" cy="13.5" r="5.5" fill="#e0a83a" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={`font-extrabold lowercase tracking-tight ${className ?? ""}`}>jollivo</span>;
}
