// True once both Clerk keys are in .env.local. Pages that need a signed-in user
// show a setup screen until then; the login and sign-up screens still render.
export const hasClerkKeys = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
