import Link from "next/link";

const FOOTER_LINKS = {
  Properties: [
    { label: "All Properties", href: "/properties" },
    { label: "Featured Listings", href: "/properties?featured=true" },
    { label: "Cebu City", href: "/properties?city=Cebu+City" },
    { label: "Mandaue", href: "/properties?city=Mandaue" },
    { label: "Lapu-Lapu", href: "/properties?city=Lapu-Lapu" },
    { label: "Talisay", href: "/properties?city=Talisay" },
  ],
  Company: [
    { label: "About NestPH", href: "/about" },
    { label: "Our Agents", href: "/agents" },
    { label: "Become an Agent", href: "/become-an-agent" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface border-t border-hairline mt-auto">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/">
              <span className="text-h3 font-semibold text-primary tracking-tight">
                NestPH
              </span>
            </Link>
            <p className="mt-3 text-body-sm text-muted leading-relaxed">
              Find your place in the Philippines. Premium property listings
              across Cebu, Mandaue, Lapu-Lapu, and Talisay.
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string }[]][]).map(
            ([column, links]) => (
              <div key={column}>
                <h3 className="text-body-sm font-semibold text-ink mb-4">
                  {column}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-muted hover:text-ink transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Legal band */}
        <div className="py-5 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-muted">
            © {new Date().getFullYear()} NestPH. All rights reserved.
          </p>

          {/* Social: Facebook + Instagram only */}
          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NestPH on Facebook"
              className="text-muted hover:text-primary transition-colors duration-150"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NestPH on Instagram"
              className="text-muted hover:text-primary transition-colors duration-150"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
