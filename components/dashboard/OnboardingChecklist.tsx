"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ChecklistAgent {
  id: string;
  bio: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface OnboardingChecklistProps {
  agent: ChecklistAgent;
  listingsCount: number;
  inquiriesCount: number;
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="10" cy="10" r="10" fill="#1b3a5c" />
        <polyline
          points="5.5,10 8.5,13 14.5,7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="10" cy="10" r="9" stroke="#c3c6cf" strokeWidth="2" />
    </svg>
  );
}

export function OnboardingChecklist({
  agent,
  listingsCount,
  inquiriesCount,
}: OnboardingChecklistProps) {
  const storageKey = `nestph_onboarding_done_${agent.id}`;

  // null = not yet read from localStorage (avoid hydration mismatch)
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  const profileDone = Boolean(agent.bio?.trim() && agent.phone?.trim() && agent.avatar_url);
  const listingsDone = listingsCount > 0;
  const inquiriesDone = inquiriesCount > 0;

  const steps = [true, profileDone, listingsDone, inquiriesDone];
  const completedCount = steps.filter(Boolean).length;
  const allDone = completedCount === 4;
  const progressPct = Math.round((completedCount / 4) * 100);

  useEffect(() => {
    setDismissed(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "true");
    setDismissed(true);
  }

  // Auto-dismiss 5 seconds after all steps complete
  useEffect(() => {
    if (!allDone || dismissed) return;
    const timer = setTimeout(dismiss, 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, dismissed]);

  // Don't render until localStorage is read (prevents flash on dismissed agents)
  if (dismissed === null || dismissed) return null;

  if (allDone) {
    return (
      <div className="bg-surface border border-hairline border-l-4 border-l-[#1b3a5c] rounded-md p-5 flex items-center justify-between gap-4">
        <p className="text-body-md font-medium text-ink">
          You&apos;re all set! 🎉 Your profile is ready for buyers.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-body-sm text-muted hover:text-ink transition-colors"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-hairline border-l-4 border-l-[#1b3a5c] rounded-md p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-body-md font-semibold text-ink">
            🚀 Getting Started
          </h2>
          <p className="text-body-sm text-muted mt-0.5">
            Complete these steps to get the most out of NestPH
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-caption text-muted hover:text-ink transition-colors mt-0.5"
          aria-label="Dismiss checklist"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-caption text-muted">{completedCount} of 4 complete</span>
          <span className="text-caption font-medium text-primary">{progressPct}%</span>
        </div>
        <div className="h-2 w-full bg-surface-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <ol className="space-y-3">
        {/* 1 — Account approved */}
        <li className="flex items-start gap-3">
          <div className="mt-0.5">
            <CheckIcon done={true} />
          </div>
          <div>
            <p className="text-body-sm font-medium text-muted line-through">
              Account approved
            </p>
          </div>
        </li>

        {/* 2 — Complete your profile */}
        <li className="flex items-start gap-3">
          <div className="mt-0.5">
            <CheckIcon done={profileDone} />
          </div>
          <div>
            {profileDone ? (
              <p className="text-body-sm font-medium text-muted line-through">
                Complete your profile
              </p>
            ) : (
              <>
                <Link
                  href="/dashboard/profile"
                  className="text-body-sm font-medium text-ink hover:text-primary hover:underline transition-colors"
                >
                  Complete your profile →
                </Link>
                <p className="text-caption text-muted mt-0.5">
                  Add your bio, phone number, and a profile photo
                </p>
              </>
            )}
          </div>
        </li>

        {/* 3 — Add your first listing */}
        <li className="flex items-start gap-3">
          <div className="mt-0.5">
            <CheckIcon done={listingsDone} />
          </div>
          <div>
            {listingsDone ? (
              <p className="text-body-sm font-medium text-muted line-through">
                Add your first listing
              </p>
            ) : (
              <>
                <Link
                  href="/dashboard/listings/new"
                  className="text-body-sm font-medium text-ink hover:text-primary hover:underline transition-colors"
                >
                  Add your first listing →
                </Link>
                <p className="text-caption text-muted mt-0.5">
                  Listings go live immediately after you publish
                </p>
              </>
            )}
          </div>
        </li>

        {/* 4 — Get your first inquiry */}
        <li className="flex items-start gap-3">
          <div className="mt-0.5">
            <CheckIcon done={inquiriesDone} />
          </div>
          <div>
            {inquiriesDone ? (
              <p className="text-body-sm font-medium text-muted line-through">
                Get your first inquiry
              </p>
            ) : (
              <>
                <p className="text-body-sm font-medium text-ink">
                  Get your first inquiry
                </p>
                <p className="text-caption text-muted mt-0.5">
                  Share your listings on Facebook and WhatsApp to attract buyers
                </p>
              </>
            )}
          </div>
        </li>
      </ol>
    </div>
  );
}
