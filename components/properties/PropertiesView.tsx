"use client";

import { useState } from "react";
import { ViewToggle, type ViewMode } from "./ViewToggle";
import { PropertyGrid } from "./PropertyGrid";
import { PropertyList } from "./PropertyList";
import type { Property } from "@/types";

interface PropertiesViewProps {
  properties: Property[];
  count: number;
  query?: string;
}

export function PropertiesView({ properties, count, query }: PropertiesViewProps) {
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <p className="text-body-md text-muted">
          <span className="font-semibold text-ink">{count}</span>{" "}
          {count === 1 ? "result" : "results"}
          {query ? (
            <>
              {" "}in{" "}
              <span className="font-semibold text-ink">{query}</span>
            </>
          ) : null}
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>
      {view === "grid" ? (
        <PropertyGrid properties={properties} />
      ) : (
        <PropertyList properties={properties} />
      )}
    </div>
  );
}
