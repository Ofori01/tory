import React from "react";

/**
 * Skeleton placeholder for the Hydraulic System flow diagram.
 * Renders a series of animated blocks arranged vertically to
 * approximate the node positions.
 */
const HydraulicSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center gap-6 animate-pulse p-6">
      {/* Fresh Water node */}
      <div className="h-12 w-40 bg-zinc-600 rounded-lg" />
      {/* Connector line */}
      <div className="h-8 w-0.5 bg-zinc-600" />
      {/* Pump 1 */}
      <div className="h-10 w-36 bg-zinc-600 rounded-lg" />
      {/* Connector line */}
      <div className="h-8 w-0.5 bg-zinc-600" />
      {/* Faucet / Grey Water row */}
      <div className="flex gap-8 items-center">
        <div className="h-10 w-28 bg-zinc-600 rounded-lg" />
        <div className="h-10 w-28 bg-zinc-600 rounded-lg" />
      </div>
      {/* Connector line */}
      <div className="h-8 w-0.5 bg-zinc-600" />
      {/* Pump 2 / Valves row */}
      <div className="flex gap-8 items-center">
        <div className="h-10 w-24 bg-zinc-600 rounded-lg" />
        <div className="h-10 w-32 bg-zinc-600 rounded-lg" />
        <div className="h-10 w-24 bg-zinc-600 rounded-lg" />
      </div>
      {/* Connector line */}
      <div className="h-8 w-0.5 bg-zinc-600" />
      {/* Toilet / Waste row */}
      <div className="flex gap-8 items-center">
        <div className="h-12 w-36 bg-zinc-600 rounded-lg" />
        <div className="h-12 w-28 bg-zinc-600 rounded-lg" />
      </div>
    </div>
  );
};

export default HydraulicSkeleton;
