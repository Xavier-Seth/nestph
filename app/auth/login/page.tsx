import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const error = params.error;
  const message = params.message;

  async function signIn(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !user) {
      redirect("/auth/login?error=invalid_credentials");
    }

    const serviceClient = createServiceClient();
    const { data: agent } = await serviceClient
      .from("agents")
      .select("role")
      .eq("id", user.id)
      .single();

    if (agent?.role === "super_admin") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-h3 font-semibold text-primary tracking-tight">
            NestPH
          </Link>
          <h1 className="text-h3 font-semibold text-ink mt-4">Welcome back</h1>
          <p className="text-body-sm text-muted mt-1">Sign in to your agent account</p>
        </div>

        {error === "invalid_credentials" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
            Invalid email or password.
          </div>
        )}
        {error === "auth_callback_failed" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
            Authentication failed. Please try again.
          </div>
        )}
        {message === "registered" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-green-50 border border-green-200 text-body-sm text-green-800">
            Account created! Sign in to continue.
          </div>
        )}
        {message === "check-email" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-blue-50 border border-blue-200 text-body-sm text-blue-800">
            Check your email to confirm your account.
          </div>
        )}

        <form action={signIn} className="bg-surface border border-hairline rounded-md p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-body-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-body-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark active:bg-primary-active transition-colors duration-150"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-body-sm text-muted mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Register as Agent
          </Link>
        </p>
      </div>
    </div>
  );
}
