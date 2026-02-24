import React from "react";

interface SectionSkeletonProps {
  rows?: number;
}

/**
 * Skeleton placeholder for a section card (InternalSection, DriverCabin, etc.).
 * Renders animated pulse rows matching the layout of SectionItem.
 */
const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ rows = 8 }) => {
  return (
    <div className="bg-card-foreground rounded-lg px-4 py-3 w-full h-full flex flex-col animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between items-center w-full grow">
          {/* Label placeholder */}
          <div className="h-3 w-24 bg-zinc-600 rounded" />
          {/* Control placeholder (toggle / radio / value) */}
          <div className="h-3 w-10 bg-zinc-600 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default SectionSkeleton;
