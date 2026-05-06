"use client";

import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [annualRate, setAnnualRate] = useState(7);
  const [termYears, setTermYears] = useState(20);

  const { monthly, loanAmount } = useMemo(() => {
    const down = propertyPrice * (downPaymentPct / 100);
    const principal = propertyPrice - down;
    const monthlyRate = annualRate / 100 / 12;
    const n = termYears * 12;

    if (monthlyRate === 0) {
      return { monthly: principal / n, loanAmount: principal };
    }

    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);

    return { monthly: isFinite(payment) ? payment : 0, loanAmount: principal };
  }, [propertyPrice, downPaymentPct, annualRate, termYears]);

  return (
    <div className="bg-surface rounded-md border border-hairline p-5">
      <h3 className="text-h3 font-semibold text-ink mb-4">Mortgage Calculator</h3>

      <div className="space-y-4">
        {/* Property Price (read-only display) */}
        <div>
          <label className="text-body-sm font-medium text-ink block mb-1.5">
            Property Price
          </label>
          <p className="text-body-md font-semibold text-primary">
            {formatPrice(propertyPrice)}
          </p>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-body-sm font-medium text-ink">
              Down Payment
            </label>
            <span className="text-body-sm font-semibold text-primary">
              {downPaymentPct}% — {formatPrice(propertyPrice * (downPaymentPct / 100))}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-caption text-muted">5%</span>
            <span className="text-caption text-muted">50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-body-sm font-medium text-ink">
              Interest Rate (per year)
            </label>
            <span className="text-body-sm font-semibold text-primary">{annualRate}%</span>
          </div>
          <input
            type="range"
            min={3}
            max={15}
            step={0.5}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-caption text-muted">3%</span>
            <span className="text-caption text-muted">15%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-body-sm font-medium text-ink">Loan Term</label>
            <span className="text-body-sm font-semibold text-primary">{termYears} years</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-caption text-muted">5 yrs</span>
            <span className="text-caption text-muted">30 yrs</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 pt-4 border-t border-hairline">
        <p className="text-body-sm text-muted mb-1">Estimated Monthly Payment</p>
        <p className="text-h2 font-semibold text-primary">{formatPrice(monthly)}</p>
        <p className="text-caption text-muted mt-1">
          Loan amount: {formatPrice(loanAmount)} · {termYears}-year term
        </p>
        <p className="text-caption text-muted mt-2">
          * Estimate only. Actual rates vary. Consult a licensed financial advisor.
        </p>
      </div>
    </div>
  );
}
