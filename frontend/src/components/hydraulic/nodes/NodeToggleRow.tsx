import React from "react";
import { cn } from "../../../lib/utils";

interface NodeToggleRowProps {
  label: string;
  enabled: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

/**
 * A single toggle row rendered inside a hydraulic node.
 * Shows a label and a small toggle switch.
 */
const NodeToggleRow: React.FC<NodeToggleRowProps> = ({
  label,
  enabled,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] leading-tight whitespace-nowrap">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => {
          if (!disabled) onChange?.(!enabled);
        }}
        className={cn(
          "nodrag nopan relative inline-flex h-3 w-6 items-center rounded-full transition-colors shrink-0 cursor-pointer",
          disabled
            ? "bg-zinc-700 cursor-not-allowed!"
            : enabled
              ? "bg-orange-500"
              : "bg-zinc-600",
        )}
      >
        <span
          className={cn(
            "inline-block h-2 w-2 transform rounded-full bg-white transition-transform pointer-events-none",
            enabled ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
};

export default NodeToggleRow;
