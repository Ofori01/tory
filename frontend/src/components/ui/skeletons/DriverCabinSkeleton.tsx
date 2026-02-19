import React from "react";

/**
 * Skeleton placeholder for the DriverCabin section.
 * Matches its two-card layout: radio items on top, value items below.
 */
const DriverCabinSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Top card — radio items */}
      <div className="bg-card-foreground rounded-lg px-4 py-3 w-full h-full flex flex-col gap-y-3.5 grow">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center w-full grow"
          >
            <div className="h-3 w-32 bg-zinc-600 rounded" />
            <div className="h-4 w-4 bg-zinc-600 rounded-full" />
          </div>
        ))}
      </div>
      {/* Bottom card — value items */}
      <div className="bg-card-foreground rounded-lg px-4 py-3 w-full flex flex-col gap-y-3.5 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center w-full grow"
          >
            <div className="h-3 w-28 bg-zinc-600 rounded" />
            <div className="h-6 w-12 bg-zinc-600 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverCabinSkeleton;
