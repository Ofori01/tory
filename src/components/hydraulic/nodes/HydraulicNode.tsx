import React, { memo } from "react";
import { Handle, type NodeProps } from "@xyflow/react";
import type { HydraulicNodeData } from "../types";
import NodeToggleRow from "./NodeToggleRow";
import NodeIndicatorRow from "./NodeIndicatorRow";
import { cn } from "../../../lib/utils";

/**
 * Generic node used in the Hydraulic System flow diagram.
 * Renders a bordered box with a label, optional toggle switches,
 * and optional status indicators. Visually dims when `active` is false.
 * Only renders the handles (connection dots) specified in data.handles.
 */
const HydraulicNode: React.FC<NodeProps> = ({ data }) => {
  const {
    label,
    toggles = [],
    indicators = [],
    active,
    handles = [],
  } = data as unknown as HydraulicNodeData;

  const hasContent = toggles.length > 0 || indicators.length > 0;

  return (
    <div
      className={cn(
        "rounded-md border-2 min-w-30 transition-all duration-200",
        active
          ? "border-orange-500 bg-card text-foreground"
          : "border-zinc-600 bg-zinc-800/60 text-zinc-500",
      )}
    >
      {/* Only render handles that are declared in the node data */}
      {handles.map((h, i) => (
        <Handle
          key={`${h.type}-${h.position}-${h.id ?? i}`}
          type={h.type}
          position={h.position}
          id={h.id}
          className={cn(
            "w-2.5! h-2.5! rounded-full! border-2!",
            active
              ? "bg-zinc-900! border-orange-500!"
              : "bg-zinc-800! border-zinc-600!",
          )}
        />
      ))}

      {/* Label row */}
      <div
        className={cn(
          "px-3 py-1.5 text-xs font-semibold tracking-wide text-center",
          hasContent && "border-b border-inherit",
        )}
      >
        {label}
      </div>

      {/* Toggles */}
      {toggles.length > 0 && (
        <div className="px-3 py-1.5 flex flex-col gap-1">
          {toggles.map((t) => (
            <NodeToggleRow
              key={t.id}
              label={t.label}
              enabled={t.enabled}
              disabled={!active}
            />
          ))}
        </div>
      )}

      {/* Indicators */}
      {indicators.length > 0 && (
        <div className="px-3 py-1.5 flex flex-col gap-1">
          {indicators.map((ind) => (
            <NodeIndicatorRow
              key={ind.id}
              label={ind.label}
              status={active ? ind.status : "fault"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(HydraulicNode);
