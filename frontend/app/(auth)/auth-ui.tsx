"use client";

import { useState, type ComponentType, type InputHTMLAttributes, type ReactNode, type SVGProps } from "react";
import { AppleIcon, EyeIcon, EyeOffIcon, GoogleIcon, LockIcon } from "@/components/icons";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  trailing?: ReactNode;
};

// Inputs use 16px text so iOS Safari doesn't zoom in when a field is focused.
export function Field({ label, icon: Icon, trailing, id, ...input }: FieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
      <span className="flex h-14 items-center gap-3 rounded-2xl border border-transparent bg-canvas px-4 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/10">
        <Icon className="size-5 shrink-0 text-ink-soft" />
        <input id={id} className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-soft/70" {...input} />
        {trailing}
      </span>
    </label>
  );
}

export function PasswordField(props: Omit<FieldProps, "icon" | "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      {...props}
      icon={LockIcon}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="-mr-2 grid size-10 place-items-center rounded-full text-ink-soft active:bg-black/5"
        >
          {visible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
        </button>
      }
    />
  );
}

export function PrimaryButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[16px] font-bold text-white btn-glow transition active:scale-[0.98] disabled:opacity-70"
    >
      {loading && <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white text-[15px] font-semibold text-ink transition active:scale-[0.98] disabled:opacity-70"
    >
      <GoogleIcon className="size-5" />
      Continue with Google
    </button>
  );
}

// Apple's guidelines ask for a black button with the Apple logo and "Continue with Apple".
export function AppleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-black text-[15px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-70"
    >
      <AppleIcon className="size-5 -translate-y-px" />
      Continue with Apple
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
      <span className="h-px flex-1 bg-black/10" />
      or
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

export function FormMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[14px] font-medium leading-snug text-red-700">
      {message}
    </p>
  );
}

export function CodeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      aria-label="Verification code"
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      placeholder="••••••"
      className="h-16 w-full rounded-2xl border border-transparent bg-canvas text-center text-[28px] font-extrabold tracking-[0.5em] text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
    />
  );
}

/** Turns a Clerk error into a sentence that's safe to show to customers. */
export function friendlyError(error: unknown): string {
  const e = error as { errors?: { longMessage?: string; message?: string }[]; longMessage?: string };
  return e?.errors?.[0]?.longMessage ?? e?.errors?.[0]?.message ?? e?.longMessage ?? "Something went wrong. Please try again.";
}

export const PREVIEW_MESSAGE = "This is a preview. Add your Clerk keys to .env.local to turn on real accounts.";
