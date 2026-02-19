import { Position, type Node, type Edge, MarkerType } from "@xyflow/react";
import type { HydraulicNodeData, HandleConfig } from "../types";
import type { HydraulicSystem } from "../../../types/dtos/settings";

/** Helper: convert an "ON"/"OFF" string to a boolean */
const isOn = (val: string): boolean => val === "ON";

/** IDs used as stable references across the system */
export const NODE_IDS = {
  FRESH_WATER: "fresh-water",
  PUMP_1: "pump-1",
  FAUCET: "faucet",
  GREY_WATER: "grey-water",
  VALVE_1: "valve-1",
  PUMP_2: "pump-2",
  VALVE_2: "valve-2",
  TOILET_SYSTEM: "toilet-system",
  WASTE: "waste",
} as const;

/* ── Shared handle presets ────────────────────────────────── */
const TOP_TARGET: HandleConfig = { type: "target", position: Position.Top };
const BOTTOM_SOURCE: HandleConfig = {
  type: "source",
  position: Position.Bottom,
};
const RIGHT_TARGET: HandleConfig = {
  type: "target",
  position: Position.Right,
  id: "right",
};
const LEFT_TARGET: HandleConfig = {
  type: "target",
  position: Position.Left,
  id: "left",
};
const LEFT_SOURCE: HandleConfig = {
  type: "source",
  position: Position.Left,
  id: "left",
};

/**
 * Build nodes from the API response.
 * When `apiData` is provided the toggle / indicator states are derived from it;
 * otherwise sensible defaults are used so the diagram still renders.
 */
export function createInitialNodes(
  apiData?: HydraulicSystem,
): Node<HydraulicNodeData>[] {
  /** Map "ON"/"OFF" → status colour for toilet-system indicators */
  const indicatorStatus = (val?: string): "normal" | "fault" =>
    val === "ON" ? "normal" : "fault";

  return [
    {
      id: NODE_IDS.FRESH_WATER,
      type: "hydraulicNode",
      position: { x: 150, y: 0 },
      data: {
        label: "Fresh Water",
        active: true,
        toggles: [
          {
            id: "empty",
            label: "Empty",
            enabled: apiData ? isOn(apiData.Fresh_Water.Empty) : false,
          },
        ],
        handles: [BOTTOM_SOURCE],
      },
    },
    {
      id: NODE_IDS.PUMP_1,
      type: "hydraulicNode",
      position: { x: 150, y: 100 },
      data: {
        label: "Pump #1",
        active: true,
        toggles: [
          {
            id: "power",
            label: "",
            enabled: apiData ? isOn(apiData.Pump_1) : true,
          },
        ],
        handles: [
          TOP_TARGET,
          BOTTOM_SOURCE,
          { type: "source", position: Position.Right, id: "right" },
        ],
      },
    },
    {
      id: NODE_IDS.FAUCET,
      type: "hydraulicNode",
      position: { x: 150, y: 200 },
      data: {
        label: "Faucet",
        active: true,
        handles: [TOP_TARGET, BOTTOM_SOURCE],
      },
    },
    {
      id: NODE_IDS.GREY_WATER,
      type: "hydraulicNode",
      position: { x: 150, y: 300 },
      data: {
        label: "Grey Water",
        active: true,
        toggles: [
          {
            id: "full",
            label: "Full",
            enabled: apiData ? isOn(apiData.Grey_Water.Full) : false,
          },
          {
            id: "empty",
            label: "Empty",
            enabled: apiData ? isOn(apiData.Grey_Water.Empty) : false,
          },
        ],
        handles: [TOP_TARGET, BOTTOM_SOURCE],
      },
    },
    {
      id: NODE_IDS.VALVE_1,
      type: "hydraulicNode",
      position: { x: 320, y: 350 },
      data: {
        label: "Valve #1",
        active: true,
        toggles: [
          {
            id: "power",
            label: "",
            enabled: apiData ? isOn(apiData.Valve_1) : true,
          },
        ],
        handles: [TOP_TARGET, BOTTOM_SOURCE],
      },
    },
    {
      id: NODE_IDS.PUMP_2,
      type: "hydraulicNode",
      position: { x: 150, y: 420 },
      data: {
        label: "Pump #2",
        active: true,
        toggles: [
          {
            id: "power",
            label: "",
            enabled: apiData ? isOn(apiData.Pump_2) : true,
          },
        ],
        handles: [TOP_TARGET, BOTTOM_SOURCE, LEFT_SOURCE],
      },
    },
    {
      id: NODE_IDS.VALVE_2,
      type: "hydraulicNode",
      position: { x: 10, y: 520 },
      data: {
        label: "Valve #2",
        active: true,
        toggles: [
          {
            id: "power",
            label: "",
            enabled: apiData ? isOn(apiData.Valve_2) : true,
          },
        ],
        handles: [TOP_TARGET, BOTTOM_SOURCE],
      },
    },
    {
      id: NODE_IDS.TOILET_SYSTEM,
      type: "hydraulicNode",
      position: { x: 150, y: 520 },
      data: {
        label: "Toilet System",
        active: true,
        indicators: [
          {
            id: "toilet",
            label: "Toilet",
            status: apiData
              ? indicatorStatus(apiData.Toilet_System.Toilet)
              : "normal",
          },
          {
            id: "controller",
            label: "Controller",
            status: apiData
              ? indicatorStatus(apiData.Toilet_System.Controller)
              : "normal",
          },
          {
            id: "vacuum-pump",
            label: "Vacuum Pump",
            status: apiData
              ? indicatorStatus(apiData.Toilet_System.Vacuum_Pump)
              : "normal",
          },
        ],
        handles: [TOP_TARGET, BOTTOM_SOURCE, RIGHT_TARGET],
      },
    },
    {
      id: NODE_IDS.WASTE,
      type: "hydraulicNode",
      position: { x: 150, y: 640 },
      data: {
        label: "Waste",
        active: true,
        toggles: [
          {
            id: "full",
            label: "Full",
            enabled: apiData ? isOn(apiData.Waste.Full) : false,
          },
        ],
        handles: [TOP_TARGET, LEFT_TARGET],
      },
    },
  ];
}

/* ── Shared edge style ────────────────────────────────────── */
const EDGE_STYLE = {
  stroke: "#ffffff",
  strokeWidth: 2,
  strokeDasharray: "8 5",
};

const MARKER_END = {
  type: MarkerType.ArrowClosed,
  color: "#ffffff",
  width: 20,
  height: 20,
};

/**
 * Edges describing the hydraulic flow.
 */
export function createInitialEdges(): Edge[] {
  return [
    // Main flow: Fresh Water → Pump #1 → Faucet → Grey Water → Pump #2
    {
      id: "e-fw-p1",
      source: NODE_IDS.FRESH_WATER,
      target: NODE_IDS.PUMP_1,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    {
      id: "e-p1-faucet",
      source: NODE_IDS.PUMP_1,
      target: NODE_IDS.FAUCET,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    {
      id: "e-faucet-gw",
      source: NODE_IDS.FAUCET,
      target: NODE_IDS.GREY_WATER,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    {
      id: "e-gw-p2",
      source: NODE_IDS.GREY_WATER,
      target: NODE_IDS.PUMP_2,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },

    // Pump #2 → Toilet System → Waste
    {
      id: "e-p2-toilet",
      source: NODE_IDS.PUMP_2,
      target: NODE_IDS.TOILET_SYSTEM,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    {
      id: "e-toilet-waste",
      source: NODE_IDS.TOILET_SYSTEM,
      target: NODE_IDS.WASTE,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },

    // Pump #1 → Valve #1 (from pump right, to valve top)
    {
      id: "e-p1-v1",
      source: NODE_IDS.PUMP_1,
      sourceHandle: "right",
      target: NODE_IDS.VALVE_1,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    // Pump #2 → Valve #2 (from pump left, to valve top)
    {
      id: "e-p2-v2",
      source: NODE_IDS.PUMP_2,
      sourceHandle: "left",
      target: NODE_IDS.VALVE_2,
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    // Valve #2 → Waste (from valve bottom, to waste left)
    {
      id: "e-v2-waste",
      source: NODE_IDS.VALVE_2,
      target: NODE_IDS.WASTE,
      targetHandle: "left",
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
    // Valve #1 → Toilet System (from valve bottom, to toilet right)
    {
      id: "e-v1-toilet",
      source: NODE_IDS.VALVE_1,
      target: NODE_IDS.TOILET_SYSTEM,
      targetHandle: "right",
      type: "smoothstep",
      style: EDGE_STYLE,
      markerEnd: MARKER_END,
    },
  ];
}
