// proxy.ts — Next.js 16 recognizes this filename as a first-class proxy entry point
// (PROXY_FILENAME = 'proxy' in Next.js 16 constants, distinct from middleware.ts).
// This runs on every request matching the config.matcher pattern below.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to both request and response so the refreshed
          // access_token is available to Server Components in this same request.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not remove or move this call. It refreshes the session
  // cookie on every request. Without it the access_token expires after ~1 hour
  // and getUser() returns null in layouts, causing spurious login redirects.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Guard /dashboard/* and /admin/* — redirect unauthenticated requests to login.
  // Fine-grained role + status checks are handled inside the layout server components.
  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) &&
    !user
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
