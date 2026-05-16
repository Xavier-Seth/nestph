import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://nestph.com";
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=auth_callback_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=auth_callback_failed`);
  }

  const serviceClient = createServiceClient();

  // Ensure agent row exists (handles edge case where trigger didn't fire)
  const { data: agent } = await serviceClient
    .from("agents")
    .select("id, role, status")
    .eq("id", user.id)
    .single();

  if (!agent) {
    await serviceClient.from("agents").upsert(
      {
        id: user.id,
        name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Agent",
        email: user.email!,
        phone: user.user_metadata?.phone ?? null,
        status: "pending",
        role: "agent",
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
    // Pending agent — dashboard layout shows the gate screen
    return NextResponse.redirect(`${appUrl}/dashboard`);
  }

  // Role-aware redirect
  if (agent.role === "super_admin") {
    return NextResponse.redirect(`${appUrl}/admin`);
  }

  if (agent.status === "suspended") {
    return NextResponse.redirect(`${appUrl}/auth/login?error=suspended`);
  }

  // approved or pending — dashboard layout handles the pending gate screen
  return NextResponse.redirect(`${appUrl}/dashboard`);
}
