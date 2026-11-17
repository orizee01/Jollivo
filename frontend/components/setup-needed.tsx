import Link from "next/link";

export function SetupNeeded() {
  return (
    <main className="flex min-h-(--app-h) flex-col justify-center bg-white px-6 py-10">
      <p className="text-5xl">🔑</p>
      <h1 className="mt-4 text-2xl font-extrabold">One step left: add your Clerk keys</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        Jollivo uses Clerk for sign up and login. Add your keys so it can start.
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-[15px]">
        <li>Open <b>dashboard.clerk.com</b> and create a free application.</li>
        <li>Go to <b>API Keys</b> and choose <b>Next.js</b>.</li>
        <li>Paste both lines into <code className="rounded bg-canvas px-1">.env.local</code> in the project folder.</li>
        <li>Restart the server: Ctrl+C, then <code className="rounded bg-canvas px-1">npm run dev -- -H 0.0.0.0</code></li>
      </ol>
      <pre className="mt-6 overflow-x-auto rounded-2xl bg-ink p-4 text-xs leading-relaxed text-white">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...`}
      </pre>
      <div className="mt-6 flex gap-3">
        <Link href="/sign-in" className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-canvas font-bold">Preview log in</Link>
        <Link href="/sign-up" className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-brand font-bold text-white">Preview sign up</Link>
      </div>
    </main>
  );
}
