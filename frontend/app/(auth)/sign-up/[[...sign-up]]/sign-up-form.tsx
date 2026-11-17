"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { MailIcon, UserIcon } from "@/components/icons";
import { CodeField, Field, FormMessage, friendlyError, AppleButton, GoogleButton, OrDivider, PasswordField, PREVIEW_MESSAGE, PrimaryButton } from "../../auth-ui";

type Details = { name: string; email: string; password: string };
type Actions = {
  signUp: (details: Details) => Promise<{ error: string | null; needsCode?: boolean }>;
  verifyCode: (code: string) => Promise<string | null>;
  resendCode: () => Promise<string | null>;
  google: () => Promise<string | null>;
  apple: () => Promise<string | null>;
};

export function SignUpForm({ live }: { live: boolean }) {
  return live ? <LiveSignUp /> : <SignUpView actions={previewActions} />;
}

const previewActions: Actions = {
  signUp: async () => ({ error: PREVIEW_MESSAGE }),
  verifyCode: async () => PREVIEW_MESSAGE,
  resendCode: async () => PREVIEW_MESSAGE,
  google: async () => PREVIEW_MESSAGE,
  apple: async () => PREVIEW_MESSAGE,
};

function LiveSignUp() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const finish = () =>
    signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.push(url);
      },
    });

  const actions: Actions = {
    async signUp({ name, email, password }) {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      const { error } = await signUp.password({ emailAddress: email, password, firstName, lastName: rest.join(" ") || undefined });
      if (error) return { error: friendlyError(error) };
      if (signUp.status === "complete") {
        await finish();
        return { error: null };
      }
      const sent = await signUp.verifications.sendEmailCode();
      if (sent.error) return { error: friendlyError(sent.error) };
      return { error: null, needsCode: true };
    },
    async verifyCode(code) {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) return friendlyError(error);
      if (signUp.status !== "complete") return "We couldn't finish creating your account. Please try again.";
      await finish();
      return null;
    },
    async resendCode() {
      const { error } = await signUp.verifications.sendEmailCode();
      return error ? friendlyError(error) : null;
    },
    async google() {
      const { error } = await signUp.sso({ strategy: "oauth_google", redirectUrl: "/", redirectCallbackUrl: "/sso-callback" });
      return error ? friendlyError(error) : null;
    },
    async apple() {
      const { error } = await signUp.sso({ strategy: "oauth_apple", redirectUrl: "/", redirectCallbackUrl: "/sso-callback" });
      return error ? friendlyError(error) : null;
    },
  };

  return <SignUpView actions={actions} />;
}

function SignUpView({ actions }: { actions: Actions }) {
  const [details, setDetails] = useState<Details>({ name: "", email: "", password: "" });
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Details) => (e: React.ChangeEvent<HTMLInputElement>) => setDetails((d) => ({ ...d, [key]: e.target.value }));

  async function run(task: () => Promise<string | null>) {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      setError(await task());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  function onSignUp(e: FormEvent) {
    e.preventDefault();
    if (details.password.length < 8) {
      setError("Your password needs at least 8 characters.");
      return;
    }
    run(async () => {
      const result = await actions.signUp({ ...details, email: details.email.trim() });
      if (result.needsCode) setStep("code");
      return result.error;
    });
  }

  if (step === "code") {
    return (
      <form onSubmit={(e) => { e.preventDefault(); run(() => actions.verifyCode(code)); }} className="flex w-full flex-col gap-5">
        <div>
          <h2 className="text-xl font-extrabold">Verify your email</h2>
          <p className="mt-1 text-[15px] text-ink-soft">Enter the 6-digit code we sent to <b className="text-ink">{details.email}</b>.</p>
        </div>
        <CodeField value={code} onChange={setCode} />
        <FormMessage message={error} />
        {notice && <p className="text-center text-sm font-semibold text-green-700">{notice}</p>}
        <PrimaryButton loading={loading}>Verify &amp; continue</PrimaryButton>
        <button
          type="button"
          disabled={loading}
          onClick={() => run(async () => { const err = await actions.resendCode(); if (!err) setNotice("New code sent."); return err; })}
          className="text-sm font-semibold text-ink-soft"
        >
          Didn&apos;t get it? <span className="text-brand">Resend code</span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSignUp} className="flex w-full flex-col gap-4">
      <Field id="name" label="Full name" icon={UserIcon} autoComplete="name" autoCapitalize="words" placeholder="Ada Okafor" required value={details.name} onChange={set("name")} />
      <Field id="email" label="Email" icon={MailIcon} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required value={details.email} onChange={set("email")} />
      <PasswordField id="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} value={details.password} onChange={set("password")} />
      <FormMessage message={error} />
      {/* Clerk's bot protection renders its check here when it's needed. */}
      <div id="clerk-captcha" />
      <div className="mt-2">
        <PrimaryButton loading={loading}>Create account</PrimaryButton>
      </div>
      <OrDivider />
      <AppleButton disabled={loading} onClick={() => run(actions.apple)} />
      <GoogleButton disabled={loading} onClick={() => run(actions.google)} />
      <p className="text-center text-xs leading-relaxed text-ink-soft">
        By creating an account you agree to Jollivo&apos;s Terms and Privacy Policy.
      </p>
      <p className="mt-2 text-center text-[15px] text-ink-soft">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-bold text-brand">Log in</Link>
      </p>
    </form>
  );
}
