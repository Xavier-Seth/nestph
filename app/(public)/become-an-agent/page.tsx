import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become an Agent",
  description: "Join NestPH as a real estate agent and list your properties across Cebu, Mandaue, Lapu-Lapu, and Talisay.",
};

const STEPS = [
  {
    step: "1",
    title: "Create your account",
    description: "Register with your name, email, and contact details. Your application is reviewed by our admin team.",
  },
  {
    step: "2",
    title: "Get approved",
    description: "Once approved, you'll receive an email confirmation and immediate access to your agent dashboard.",
  },
  {
    step: "3",
    title: "List your properties",
    description: "Upload up to 10 photos per listing, set your price, and your property goes live on NestPH.",
  },
  {
    step: "4",
    title: "Connect with buyers",
    description: "Receive direct inquiries from interested buyers. Manage everything from your dashboard.",
  },
];

const BENEFITS = [
  { icon: "🏠", title: "Unlimited listings", desc: "List as many properties as you manage, no caps." },
  { icon: "📸", title: "Photo galleries", desc: "Up to 10 professional photos per listing." },
  { icon: "📩", title: "Direct inquiries", desc: "Buyers contact you directly — no middleman." },
  { icon: "📊", title: "Performance stats", desc: "Track views and inquiries from your dashboard." },
  { icon: "🤝", title: "Facebook Messenger", desc: "Let buyers message you instantly via Messenger." },
  { icon: "🆓", title: "Free to join", desc: "No monthly fees. Just register and get approved." },
];

export default function BecomeAnAgentPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 80% 50%, #2d5a8e 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-h1 font-semibold text-white">
            Grow your real estate business with NestPH
          </h1>
          <p className="mt-5 text-body-lg text-white/75 max-w-2xl mx-auto">
            Join our network of trusted agents selling properties across Cebu City,
            Mandaue, Lapu-Lapu, and Talisay. List for free. Connect with serious buyers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="h-12 px-8 rounded-sm bg-white text-primary text-body-md font-semibold hover:bg-surface-soft transition-colors duration-150 inline-flex items-center justify-center"
            >
              Register as Agent
            </Link>
            <Link
              href="/auth/login"
              className="h-12 px-8 rounded-sm border border-white/40 text-white text-body-md font-medium hover:bg-white/10 transition-colors duration-150 inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-canvas">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-ink text-center mb-10">
            Everything you need to sell
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-surface rounded-md border border-hairline p-6"
              >
                <span className="text-[2rem]" aria-hidden="true">{b.icon}</span>
                <h3 className="text-body-md font-semibold text-ink mt-3">{b.title}</h3>
                <p className="text-body-sm text-muted mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-surface">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 font-semibold text-ink text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-body-md font-semibold shrink-0">
                    {s.step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-hairline" aria-hidden="true" />
                  )}
                </div>
                <h3 className="text-body-md font-semibold text-ink">{s.title}</h3>
                <p className="text-body-sm text-muted mt-1 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-canvas">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h2 font-semibold text-ink">Ready to get started?</h2>
          <p className="text-body-lg text-muted mt-3 max-w-xl mx-auto">
            Registration is free. Create your account and start listing properties today.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/register"
              className="h-12 px-10 rounded-sm bg-primary text-white text-body-md font-semibold hover:bg-primary-dark transition-colors duration-150 inline-flex items-center justify-center"
            >
              Create Agent Account
            </Link>
          </div>
          <p className="text-body-sm text-muted mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
