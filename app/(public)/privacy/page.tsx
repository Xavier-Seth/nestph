import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NestPH Privacy Policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl">
        <h1 className="text-h1 font-semibold text-ink">Privacy Policy</h1>
        <p className="text-caption text-muted mt-2">Last updated: January 2025</p>

        <div className="mt-10 space-y-10">
          {[
            {
              title: "1. Information We Collect",
              body: `We collect information you provide directly: name, email, phone number when you register as an agent or submit a contact inquiry. We also collect usage data (pages visited, time on site) via analytics tools. No financial data is collected or stored on our servers.`,
            },
            {
              title: "2. How We Use Your Information",
              body: `We use your information to: operate and improve the Platform, send transactional emails (inquiry notifications, agent approval), verify agent identity, and respond to support requests. We do not sell your personal data to third parties.`,
            },
            {
              title: "3. Contact Form Inquiries",
              body: `When you submit a contact inquiry, your name, email, phone, and message are stored in our database and forwarded to the relevant agent via email. Inquiry data is retained to support agent-buyer communication and platform moderation.`,
            },
            {
              title: "4. Cookies & Tracking",
              body: `NestPH uses cookies to manage user sessions (Supabase Auth) and basic analytics. We use Google reCAPTCHA v3 to detect spam on contact forms — this service processes data according to Google's Privacy Policy. By using the Platform, you consent to this use.`,
            },
            {
              title: "5. Data Storage & Security",
              body: `Your data is stored on Supabase (PostgreSQL) with Row Level Security enabled. All API routes use parameterized queries and input validation. Sensitive server keys are never exposed to the browser. We apply industry-standard security practices.`,
            },
            {
              title: "6. Third-Party Services",
              body: `We use the following third-party services: Supabase (database & auth), Resend (transactional email), Upstash Redis (rate limiting), Google reCAPTCHA (spam protection). Each service has its own privacy policy governing their data practices.`,
            },
            {
              title: "7. Your Rights",
              body: `Under the Philippines Data Privacy Act of 2012 (RA 10173), you have the right to access, correct, or delete your personal data. To exercise these rights, contact us through our Contact page. We will respond within 10 business days.`,
            },
            {
              title: "8. Children's Privacy",
              body: `NestPH is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has submitted information to us, please contact us immediately.`,
            },
            {
              title: "9. Changes to This Policy",
              body: `We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision. Continued use of the Platform after changes constitutes acceptance of the updated policy.`,
            },
            {
              title: "10. Contact Us",
              body: `If you have any questions about this Privacy Policy or how your data is handled, please reach out through our Contact page. We take privacy seriously and will address your concerns promptly.`,
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-h3 font-semibold text-ink">{section.title}</h2>
              <p className="text-body-md text-body leading-relaxed mt-3">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
