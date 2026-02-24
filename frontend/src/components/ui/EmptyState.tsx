import React from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

/**
 * Displayed when a section has no data to show.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-full w-full text-zinc-400 text-sm",
        className,
      )}
    >
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
