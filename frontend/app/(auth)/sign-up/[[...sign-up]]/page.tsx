import { hasClerkKeys } from "@/lib/clerk";
import { AuthShell } from "../../auth-shell";
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <AuthShell title="Create account" subtitle="Hungry? You're 30 seconds away" emoji="🍔">
      <SignUpForm live={hasClerkKeys} />
    </AuthShell>
  );
}
