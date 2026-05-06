import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const CITIES = [
  {
    name: "Cebu City",
    description: "The Queen City of the South",
    bg: "from-[#1B3A5C] to-[#2d6a9f]",
  },
  {
    name: "Mandaue",
    description: "Industrial & residential hub",
    bg: "from-[#002444] to-[#1B3A5C]",
  },
  {
    name: "Lapu-Lapu",
    description: "Gateway to Mactan Island",
    bg: "from-[#152D47] to-[#1f4a75]",
  },
  {
    name: "Talisay",
    description: "Scenic south Cebu living",
    bg: "from-[#0f2235] to-[#1B3A5C]",
  },
];

export async function LocationCollections() {
  const supabase = await createClient();

  // Fetch listing counts per city
  const { data: counts } = await supabase
    .from("properties")
    .select("city")
    .eq("status", "for_sale");

  const cityCount: Record<string, number> = {};
  (counts ?? []).forEach((row) => {
    cityCount[row.city] = (cityCount[row.city] ?? 0) + 1;
  });

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-h2 font-semibold text-ink">Explore by Location</h2>
          <p className="text-body-md text-muted mt-2">
            Find properties in the most desirable cities across Cebu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CITIES.map((city) => {
            const count = cityCount[city.name] ?? 0;
            return (
              <Link
                key={city.name}
                href={`/properties?city=${encodeURIComponent(city.name)}`}
                className="group block"
              >
                <div
                  className={`relative h-52 rounded-md overflow-hidden bg-gradient-to-br ${city.bg} flex flex-col justify-end p-5 transition-shadow duration-200 hover:shadow-card`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />

                  <div className="relative">
                    <p className="text-h3 font-semibold text-white group-hover:text-white/90 transition-colors">
                      {city.name}
                    </p>
                    <p className="text-body-sm text-white/70 mt-0.5">{city.description}</p>
                    <p className="text-caption text-white/60 mt-2 font-medium">
                      {count > 0 ? `${count} listing${count !== 1 ? "s" : ""}` : "Explore area"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
