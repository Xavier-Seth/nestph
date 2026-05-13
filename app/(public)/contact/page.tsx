import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with NestPH. We're happy to help with any questions about property listings or agent services.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl">
        <h1 className="text-h1 font-semibold text-ink">Contact Us</h1>
        <p className="text-body-lg text-muted mt-3">
          Have a question about a listing, an agent, or NestPH? Send us a message
          and we&apos;ll get back to you shortly.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
        {/* Form */}
        <div className="bg-surface rounded-md border border-hairline p-8">
          <p className="text-body-sm text-muted mb-6">
            All fields marked <span className="text-error">*</span> are required.
          </p>
          <form className="space-y-5" aria-label="Contact form">
            {/* Honeypot — hidden from humans */}
            <input
              type="text"
              name="_gotcha"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-outline transition-colors"
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
                  className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-outline transition-colors"
                />
              </div>
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
                className="h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-outline transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-body-sm font-medium text-ink">
                Message <span className="text-error" aria-hidden="true">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="I'm interested in a property at…"
                className="w-full rounded-sm border border-hairline px-3 py-2.5 text-body-md text-ink bg-canvas placeholder:text-muted resize-vertical focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-outline transition-colors min-h-30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="h-11 px-8 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark active:bg-primary-active transition-colors duration-150"
              >
                Send Message
              </button>
              <p className="text-caption text-muted mt-3">
                By submitting, you agree to our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-surface rounded-md border border-hairline p-6">
            <h2 className="text-body-md font-semibold text-ink mb-4">Get in touch</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="text-[1.25rem] shrink-0" aria-hidden="true">📍</span>
                <div>
                  <p className="text-body-sm font-medium text-ink">Location</p>
                  <p className="text-body-sm text-muted mt-0.5">Cebu City, Philippines</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[1.25rem] shrink-0" aria-hidden="true">🕐</span>
                <div>
                  <p className="text-body-sm font-medium text-ink">Response time</p>
                  <p className="text-body-sm text-muted mt-0.5">Within 1–2 business days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-md border border-hairline p-6">
            <h2 className="text-body-md font-semibold text-ink mb-2">Looking for an agent?</h2>
            <p className="text-body-sm text-muted leading-relaxed">
              Browse our verified agents and send them a direct inquiry from
              any property listing page.
            </p>
            <Link
              href="/agents"
              className="mt-4 inline-flex items-center text-body-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Browse agents →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
