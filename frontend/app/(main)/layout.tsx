import { BottomNav } from "@/components/bottom-nav";
import { SetupNeeded } from "@/components/setup-needed";
import { hasClerkKeys } from "@/lib/clerk";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // These pages read the signed-in user from Clerk, so they need the keys to run.
  if (!hasClerkKeys) return <SetupNeeded />;

  return (
    <>
      <div className="pb-[calc(6.5rem+var(--safe-bottom))]">{children}</div>
      <BottomNav />
    </>
  );
}
