/** Shared types for the Hydraulic System flow diagram */

import type { Position } from "@xyflow/react";

/** A toggleable control inside a node (e.g. "Empty", "Full") */
export interface NodeToggle {
  id: string;
  label: string;
  enabled: boolean;
}

/** A status indicator inside a node (e.g. Toilet, Controller, Vacuum Pump) */
export interface NodeStatusIndicator {
  id: string;
  label: string;
  status: "normal" | "fault" | "warning";
}

/** Describes a single handle (connection point) on a node */
export interface HandleConfig {
  type: "source" | "target";
  position: Position;
  id?: string;
}

/** Data payload carried by every hydraulic node */
export interface HydraulicNodeData {
  [key: string]: unknown;
  label: string;
  /** Toggle switches rendered inside the node */
  toggles?: NodeToggle[];
  /** Status indicator dots rendered inside the node */
  indicators?: NodeStatusIndicator[];
  /** Whether the node is currently active (powered / enabled) */
  active: boolean;
  /** Which handles (connection dots) this node should render */
  handles?: HandleConfig[];
}
