import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NestPH Terms of Service — understand your rights and responsibilities when using our platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl">
        <h1 className="text-h1 font-semibold text-ink">Terms of Service</h1>
        <p className="text-caption text-muted mt-2">Last updated: January 2025</p>

        <div className="mt-10 prose-section space-y-10">
          {[
            {
              title: "1. Acceptance of Terms",
              body: `By accessing or using NestPH (\"the Platform\"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. These terms apply to all users, including visitors, registered agents, and the Super Admin.`,
            },
            {
              title: "2. Use of the Platform",
              body: `NestPH is a real estate listing platform for property sales in the Philippines. The Platform may only be used for lawful purposes. You agree not to: misrepresent property information, submit fraudulent listings, use automated systems to scrape content, or interfere with the operation of the Platform.`,
            },
            {
              title: "3. Agent Accounts",
              body: `Agent registration is subject to approval by the NestPH administrator. Approved agents are responsible for the accuracy of all listing information they post. NestPH reserves the right to suspend or remove agents who violate these terms or post misleading listings.`,
            },
            {
              title: "4. Property Listings",
              body: `All property listings are for sale only — no rental listings are permitted. Agents must own or be authorized to list the properties they post. Images must be original or properly licensed. NestPH is not liable for inaccuracies in listing information.`,
            },
            {
              title: "5. Inquiries",
              body: `Contact inquiries submitted through the Platform are forwarded to the relevant agent. NestPH does not act as a broker or intermediary. Any transaction between buyer and agent is independent of NestPH.`,
            },
            {
              title: "6. Intellectual Property",
              body: `All content on NestPH — including design, code, branding, and text — is the property of NestPH. Agent-submitted content (photos, listing descriptions) remains the property of the agent, but by submitting you grant NestPH a non-exclusive license to display it on the Platform.`,
            },
            {
              title: "7. Disclaimers",
              body: `NestPH provides this Platform on an "as is" basis without warranties of any kind. We do not guarantee the accuracy of listing information, the availability of properties, or the conduct of any agent or buyer.`,
            },
            {
              title: "8. Limitation of Liability",
              body: `NestPH shall not be liable for any indirect, incidental, or consequential damages arising from use of the Platform. Our total liability is limited to the amount paid by you (if any) in the 12 months preceding the claim.`,
            },
            {
              title: "9. Modifications",
              body: `NestPH may modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms. We will update the "Last updated" date above when changes are made.`,
            },
            {
              title: "10. Contact",
              body: `For questions about these Terms, contact us at the email address listed on our Contact page.`,
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
