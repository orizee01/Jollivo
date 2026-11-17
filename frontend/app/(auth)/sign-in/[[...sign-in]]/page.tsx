import { hasClerkKeys } from "@/lib/clerk";
import { AuthShell } from "../../auth-shell";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to order your favourites" emoji="🍕">
      <SignInForm live={hasClerkKeys} />
    </AuthShell>
  );
}
