import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Register as Agent" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const error = params.error;

  async function signUp(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const phone = ((formData.get("phone") as string) || "").trim() || null;

    if (!name || !email || password.length < 8) {
      redirect("/auth/register?error=invalid_input");
    }

    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        redirect("/auth/register?error=email_taken");
      }
      redirect("/auth/register?error=signup_failed");
    }

    if (data.user && data.session) {
      const serviceClient = createServiceClient();
      const { data: existing } = await serviceClient
        .from("agents")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existing) {
        await serviceClient.from("agents").insert({
          id: data.user.id,
          name,
          email,
          phone,
          status: "pending",
          role: "agent",
        });
      }
      redirect("/dashboard");
    }

    redirect("/auth/login?message=check-email");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-h3 font-semibold text-primary tracking-tight">
            NestPH
          </Link>
          <h1 className="text-h3 font-semibold text-ink mt-4">Become an Agent</h1>
          <p className="text-body-sm text-muted mt-1">
            Create your account — approval required
          </p>
        </div>

        {error === "invalid_input" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
            Please fill in all required fields. Password must be at least 8 characters.
          </div>
        )}
        {error === "email_taken" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
            That email is already registered.{" "}
            <Link href="/auth/login" className="underline">Sign in instead?</Link>
          </div>
        )}
        {error === "signup_failed" && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
            Registration failed. Please try again.
          </div>
        )}

        <form action={signUp} className="bg-surface border border-hairline rounded-md p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-body-sm font-medium text-ink">
              Full Name <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Maria Santos"
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-body-sm font-medium text-ink">
              Email <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="maria@example.com"
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-body-sm font-medium text-ink">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+63 9XX XXX XXXX"
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-body-sm font-medium text-ink">
              Password <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark active:bg-primary-active transition-colors duration-150"
          >
            Create Account
          </button>

          <p className="text-caption text-muted text-center">
            By registering, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </form>

        <p className="text-center text-body-sm text-muted mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
