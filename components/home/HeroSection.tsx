"use client";

import { SearchBar } from "@/components/properties/SearchBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 lg:py-36">
      {/* Decorative background gradients */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, #2d5a8e 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #002444 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-body-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
          Premium Real Estate · Philippines
        </p>
        <h1 className="text-h1 font-semibold text-white leading-tight max-w-3xl mx-auto">
          Find your place in the Philippines
        </h1>
        <p className="mt-5 text-body-lg text-white/75 max-w-2xl mx-auto">
          Browse premium property listings across Cebu City, Mandaue, Lapu-Lapu,
          and Talisay. Verified listings. Trusted agents.
        </p>
        <div className="mt-10">
          <SearchBar variant="hero" />
        </div>
        <p className="mt-5 text-caption text-white/50">
          Properties for sale · No rentals
        </p>
      </div>
    </section>
  );
}
