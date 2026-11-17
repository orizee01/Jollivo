"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { MailIcon } from "@/components/icons";
import { CodeField, Field, FormMessage, friendlyError, AppleButton, GoogleButton, OrDivider, PasswordField, PREVIEW_MESSAGE, PrimaryButton } from "../../auth-ui";

type Actions = {
  logIn: (email: string, password: string) => Promise<{ error: string | null; needsCode?: boolean }>;
  verifyCode: (code: string) => Promise<string | null>;
  google: () => Promise<string | null>;
  apple: () => Promise<string | null>;
};

export function SignInForm({ live }: { live: boolean }) {
  return live ? <LiveSignIn /> : <SignInView actions={previewActions} />;
}

const previewActions: Actions = {
  logIn: async () => ({ error: PREVIEW_MESSAGE }),
  verifyCode: async () => PREVIEW_MESSAGE,
  google: async () => PREVIEW_MESSAGE,
  apple: async () => PREVIEW_MESSAGE,
};

function LiveSignIn() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const finish = () =>
    signIn.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.push(url);
      },
    });

  const actions: Actions = {
    async logIn(email, password) {
      const { error } = await signIn.password({ identifier: email, password });
      if (error) return { error: friendlyError(error) };
      if (signIn.status === "complete") {
        await finish();
        return { error: null };
      }
      // Logging in on a new device can ask for a one-time code sent by email.
      const canEmailCode = signIn.supportedSecondFactors.some((f) => f.strategy === "email_code");
      if ((signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") && canEmailCode) {
        const sent = await signIn.mfa.sendEmailCode();
        if (sent.error) return { error: friendlyError(sent.error) };
        return { error: null, needsCode: true };
      }
      return { error: "This account needs an extra sign-in step. Please try Continue with Google or contact support." };
    },
    async verifyCode(code) {
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) return friendlyError(error);
      if (signIn.status !== "complete") return "That code didn't work. Please try again.";
      await finish();
      return null;
    },
    async google() {
      const { error } = await signIn.sso({ strategy: "oauth_google", redirectUrl: "/", redirectCallbackUrl: "/sso-callback" });
      return error ? friendlyError(error) : null;
    },
    async apple() {
      const { error } = await signIn.sso({ strategy: "oauth_apple", redirectUrl: "/", redirectCallbackUrl: "/sso-callback" });
      return error ? friendlyError(error) : null;
    },
  };

  return <SignInView actions={actions} />;
}

function SignInView({ actions }: { actions: Actions }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(task: () => Promise<string | null>) {
    setLoading(true);
    setError(null);
    try {
      setError(await task());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  function onLogIn(e: FormEvent) {
    e.preventDefault();
    run(async () => {
      const result = await actions.logIn(email.trim(), password);
      if (result.needsCode) setStep("code");
      return result.error;
    });
  }

  if (step === "code") {
    return (
      <form onSubmit={(e) => { e.preventDefault(); run(() => actions.verifyCode(code)); }} className="flex w-full flex-col gap-5">
        <div>
          <h2 className="text-xl font-extrabold">Check your email</h2>
          <p className="mt-1 text-[15px] text-ink-soft">We sent a 6-digit code to <b className="text-ink">{email}</b>.</p>
        </div>
        <CodeField value={code} onChange={setCode} />
        <FormMessage message={error} />
        <PrimaryButton loading={loading}>Verify &amp; log in</PrimaryButton>
        <button type="button" onClick={() => { setStep("details"); setCode(""); setError(null); }} className="text-sm font-semibold text-ink-soft">
          Use a different account
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onLogIn} className="flex w-full flex-col gap-4">
      <Field id="email" label="Email" icon={MailIcon} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordField id="password" label="Password" autoComplete="current-password" placeholder="Your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <FormMessage message={error} />
      <div className="mt-2">
        <PrimaryButton loading={loading}>Log in</PrimaryButton>
      </div>
      <OrDivider />
      <AppleButton disabled={loading} onClick={() => run(actions.apple)} />
      <GoogleButton disabled={loading} onClick={() => run(actions.google)} />
      <p className="mt-4 text-center text-[15px] text-ink-soft">
        New to Jollivo?{" "}
        <Link href="/sign-up" className="font-bold text-brand">Create an account</Link>
      </p>
    </form>
  );
}
