"use client";

import { useCallback, useId } from "react";
import { formatPrice } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  label?: string;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 500_000,
  label,
}: PriceRangeSliderProps) {
  const id = useId();
  const [minVal, maxVal] = value;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.min(Number(e.target.value), maxVal - step);
      onChange([next, maxVal]);
    },
    [maxVal, onChange, step]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.max(Number(e.target.value), minVal + step);
      onChange([minVal, next]);
    },
    [minVal, onChange, step]
  );

  const range = max - min;
  const minPct = ((minVal - min) / range) * 100;
  const maxPct = ((maxVal - min) / range) * 100;

  return (
    <div className="w-full">
      {label && (
        <p className="text-body-sm font-medium text-ink mb-3">{label}</p>
      )}

      {/* Value display */}
      <div className="flex justify-between mb-3">
        <span className="text-body-sm font-medium text-ink">
          {formatPrice(minVal)}
        </span>
        <span className="text-body-sm font-medium text-ink">
          {formatPrice(maxVal)}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-5 select-none">
        {/* Base track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-hairline" />

        {/* Active fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary"
          style={{
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`,
          }}
        />

        {/* Min input — transparent, sits on top for interaction */}
        <input
          type="range"
          id={`${id}-min`}
          aria-label="Minimum price"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: minVal > max - step ? 5 : 3 }}
        />

        {/* Max input */}
        <input
          type="range"
          id={`${id}-max`}
          aria-label="Maximum price"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />

        {/* Min thumb (visual only, pointer-events-none) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-card pointer-events-none"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />

        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-card pointer-events-none"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>
    </div>
  );
}
