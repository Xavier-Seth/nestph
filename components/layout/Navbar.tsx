"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@/lib/supabase/client";
import type { Agent } from "@/types";
import { cn } from "@/lib/utils";

type AuthAgent = Pick<Agent, "role" | "status"> | null;

const NAV_LINKS = [
  { label: "Properties", href: "/properties" },
  { label: "Agents", href: "/agents" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [agent, setAgent] = useState<AuthAgent>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();

  // Scroll shadow
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth state
  useEffect(() => {
    const supabase = createClient();

    async function loadAgent() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAgent(null);
        return;
      }
      const { data } = await supabase
        .from("agents")
        .select("role, status")
        .eq("id", user.id)
        .single();
      setAgent(data ?? null);
    }

    loadAgent();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAgent();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isApproved =
    agent?.role === "super_admin" ||
    (agent?.role === "agent" && agent.status === "approved");

  const dashboardHref = agent?.role === "super_admin" ? "/admin" : "/dashboard";
  const dashboardLabel = agent?.role === "super_admin" ? "Admin" : "Dashboard";

  const listHref = isApproved ? "/dashboard/listings/new" : "/become-an-agent";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
    } catch {
      // navigate regardless
    }
    window.location.href = "/";
  }

  const linkClass = (href: string) =>
    cn(
      "px-3 py-2 rounded-sm text-body-sm font-medium transition-colors duration-150",
      isActive(href)
        ? "text-primary bg-secondary-container"
        : "text-body hover:text-ink hover:bg-surface-soft"
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-canvas border-b border-hairline transition-shadow duration-200",
        scrolled && "shadow-card"
      )}
    >
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-h3 font-semibold text-primary tracking-tight">
              NestPH
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            {agent && isApproved && (
              <Link href={dashboardHref} className={linkClass(dashboardHref)}>
                {dashboardLabel}
              </Link>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {agent ? (
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="h-9 px-4 rounded-sm text-body-sm font-medium text-body hover:text-ink hover:bg-surface-soft transition-colors duration-150 disabled:opacity-50"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="h-9 px-4 rounded-sm text-body-sm font-medium text-body hover:text-ink hover:bg-surface-soft transition-colors duration-150 inline-flex items-center"
              >
                Sign In
              </Link>
            )}
            <Link
              href={listHref}
              className="h-9 px-4 rounded-sm text-body-sm font-medium bg-primary text-white hover:bg-primary-dark active:bg-primary-active transition-colors duration-150 inline-flex items-center"
            >
              List Property
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] shrink-0"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "block w-5 h-0.5 bg-ink transition-all duration-200 origin-center",
                mobileOpen && "rotate-45 translate-y-[7px]"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-ink transition-opacity duration-200",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-ink transition-all duration-200 origin-center",
                mobileOpen && "-rotate-45 -translate-y-[7px]"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas">
          <div className="mx-auto max-w-[80rem] px-4 py-3 flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-3 rounded-sm text-body-md font-medium transition-colors duration-150",
                  isActive(link.href)
                    ? "text-primary bg-secondary-container"
                    : "text-ink hover:bg-surface-soft"
                )}
              >
                {link.label}
              </Link>
            ))}
            {agent && isApproved && (
              <Link
                href={dashboardHref}
                className={cn(
                  "px-3 py-3 rounded-sm text-body-md font-medium transition-colors duration-150",
                  isActive(dashboardHref)
                    ? "text-primary bg-secondary-container"
                    : "text-ink hover:bg-surface-soft"
                )}
              >
                {dashboardLabel}
              </Link>
            )}

            <div className="pt-3 mt-1 border-t border-hairline flex flex-col gap-2">
              {agent ? (
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="text-left px-3 py-3 rounded-sm text-body-md font-medium text-ink hover:bg-surface-soft transition-colors duration-150 disabled:opacity-50"
                >
                  {signingOut ? "Signing out..." : "Sign Out"}
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-3 py-3 rounded-sm text-body-md font-medium text-ink hover:bg-surface-soft transition-colors duration-150"
                >
                  Sign In
                </Link>
              )}
              <Link
                href={listHref}
                className="px-4 py-3 rounded-sm text-center text-body-md font-medium bg-primary text-white hover:bg-primary-dark transition-colors duration-150"
              >
                List Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
