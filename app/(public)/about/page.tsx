import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NestPH",
  description: "Learn about NestPH — the premium real estate listing platform for property sales in Cebu, Philippines.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-h1 font-semibold text-ink">About NestPH</h1>
        <p className="text-body-lg text-muted mt-4 leading-relaxed">
          NestPH is a premium real estate listing platform dedicated to property
          sales across Cebu City, Mandaue, Lapu-Lapu, and Talisay in the Philippines.
        </p>
      </div>

      {/* Divider */}
      <div className="my-12 h-px bg-hairline" />

      {/* Mission */}
      <section className="max-w-3xl">
        <h2 className="text-h2 font-semibold text-ink mb-4">Our Mission</h2>
        <p className="text-body-md text-body leading-relaxed">
          We believe finding a home should be transparent, straightforward, and
          stress-free. NestPH connects serious buyers with verified, licensed real
          estate agents — no rental listings, no clutter, just properties for sale.
        </p>
        <p className="text-body-md text-body leading-relaxed mt-4">
          Every listing on NestPH comes from an approved agent. We manually review
          each agent registration to ensure buyers are always working with legitimate
          professionals.
        </p>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="text-h2 font-semibold text-ink mb-8">Why NestPH</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Sales only",
              desc: "We focus exclusively on property sales — no rentals, no confusion.",
              icon: "🏠",
            },
            {
              title: "Verified agents",
              desc: "Every agent is reviewed and approved before they can list a single property.",
              icon: "✅",
            },
            {
              title: "Local expertise",
              desc: "Built for the Cebu real estate market — cities, pricing, and culture we know well.",
              icon: "📍",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="bg-surface rounded-md border border-hairline p-6"
            >
              <span className="text-[2rem]" aria-hidden="true">{v.icon}</span>
              <h3 className="text-body-md font-semibold text-ink mt-3">{v.title}</h3>
              <p className="text-body-sm text-muted mt-1 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 bg-surface rounded-md border border-hairline p-8 text-center">
        <h2 className="text-h3 font-semibold text-ink">Find your place in the Philippines</h2>
        <p className="text-body-md text-muted mt-2">
          Browse premium property listings or join as an agent today.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/properties"
            className="h-11 px-8 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark transition-colors duration-150 inline-flex items-center justify-center"
          >
            Browse Properties
          </Link>
          <Link
            href="/become-an-agent"
            className="h-11 px-8 rounded-sm border border-primary text-primary text-body-sm font-medium hover:bg-secondary-container transition-colors duration-150 inline-flex items-center justify-center"
          >
            Become an Agent
          </Link>
        </div>
      </section>
    </div>
  );
}
