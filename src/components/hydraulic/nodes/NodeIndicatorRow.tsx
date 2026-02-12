import React from "react";
import { cn } from "../../../lib/utils";

interface NodeIndicatorRowProps {
  label: string;
  status: "normal" | "fault" | "warning";
}

const STATUS_COLORS: Record<string, string> = {
  normal: "bg-green-500",
  warning: "bg-yellow-500",
  fault: "bg-red-500",
};

/**
 * A single status indicator row rendered inside a hydraulic node.
 * Shows a coloured dot and a label.
 */
const NodeIndicatorRow: React.FC<NodeIndicatorRowProps> = ({
  label,
  status,
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] leading-tight whitespace-nowrap">
        {label}
      </span>
      <div
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          STATUS_COLORS[status] ?? STATUS_COLORS.fault,
        )}
      />
    </div>
  );
};

export default NodeIndicatorRow;
