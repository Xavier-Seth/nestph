interface AgentStatsGridProps {
  propertiesSold: number;
  yearsExperience: number;
}

export function AgentStatsGrid({ propertiesSold, yearsExperience }: AgentStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface rounded-md border border-hairline p-5 text-center">
        <p className="text-h2 font-semibold text-primary">{propertiesSold}</p>
        <p className="text-body-sm text-muted mt-1">Properties Sold</p>
      </div>
      <div className="bg-surface rounded-md border border-hairline p-5 text-center">
        <p className="text-h2 font-semibold text-primary">{yearsExperience}</p>
        <p className="text-body-sm text-muted mt-1">Years Experience</p>
      </div>
    </div>
  );
}
