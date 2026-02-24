
import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type DefaultEdgeOptions,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { HydraulicNode } from "./nodes";
import { createInitialNodes, createInitialEdges, NODE_IDS } from "./config";
import type {
  HydraulicSystem as HydraulicSystemData,
  SettingsResponse,
} from "../../types/dtos/settings";
import type { HydraulicNodeData } from "./types";

/** Register custom node types once (outside render) */
const nodeTypes: NodeTypes = {
  hydraulicNode: HydraulicNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

/**
 * Maps a (nodeId, toggleId, value) triple to the partial
 * SettingsResponse payload for the PATCH request.
 */
function buildHydraulicPatch(
  nodeId: string,
  toggleId: string,
  value: boolean,
  currentData: HydraulicSystemData,
): Partial<SettingsResponse> {
  const v = value ? "ON" : "OFF";

  switch (nodeId) {
    case NODE_IDS.FRESH_WATER:
      return {
        General: {
          Hydraulic_System: { ...currentData, Fresh_Water: { ...currentData.Fresh_Water, [toggleId === "empty" ? "Empty" : toggleId]: v } },
        } as SettingsResponse["General"],
      };
    case NODE_IDS.PUMP_1:
      return {
        General: {
          Hydraulic_System: { ...currentData, Pump_1: v },
        } as SettingsResponse["General"],
      };
    case NODE_IDS.GREY_WATER: {
      const field = toggleId === "full" ? "Full" : "Empty";
      return {
        General: {
          Hydraulic_System: { ...currentData, Grey_Water: { ...currentData.Grey_Water, [field]: v } },
        } as SettingsResponse["General"],
      };
    }
    case NODE_IDS.VALVE_1:
      return {
        General: {
          Hydraulic_System: { ...currentData, Valve_1: v },
        } as SettingsResponse["General"],
      };
    case NODE_IDS.PUMP_2:
      return {
        General: {
          Hydraulic_System: { ...currentData, Pump_2: v },
        } as SettingsResponse["General"],
      };
    case NODE_IDS.VALVE_2:
      return {
        General: {
          Hydraulic_System: { ...currentData, Valve_2: v },
        } as SettingsResponse["General"],
      };
    case NODE_IDS.WASTE:
      return {
        General: {
          Hydraulic_System: { ...currentData, Waste: { ...currentData.Waste, [toggleId === "full" ? "Full" : toggleId]: v } },
        } as SettingsResponse["General"],
      };
    default:
      return {};
  }
}

interface HydraulicSystemProps {
  data: HydraulicSystemData;
  onSettingChange: (patch: Partial<SettingsResponse>) => void;
}

/**
 * The main Hydraulic System flow diagram.
 */
const HydraulicSystem: React.FC<HydraulicSystemProps> = ({
  data,
  onSettingChange,
}) => {
  const baseNodes = useMemo(() => createInitialNodes(data), [data]);
  const edges = useMemo(() => createInitialEdges(), []);

  /** Inject onToggleChange into every node so toggles trigger PATCH */
  const handleToggleChange = useCallback(
    (nodeId: string, toggleId: string, value: boolean) => {
      const patch = buildHydraulicPatch(nodeId, toggleId, value, data);
      onSettingChange(patch);
    },
    [data, onSettingChange],
  );

  const nodes = useMemo(
    () =>
      baseNodes.map((node) => ({
        ...node,
        data: {
          ...(node.data as HydraulicNodeData),
          onToggleChange: (toggleId: string, value: boolean) =>
            handleToggleChange(node.id, toggleId, value),
        },
      })),
    [baseNodes, handleToggleChange],
  );

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 450 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.05, maxZoom: 1.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={true}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={true}
        preventScrolling={false}
        minZoom={0.4}
        maxZoom={1.5}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Cross}
          gap={16}
          size={3}
          color="rgba(255, 255, 255, 0.15)"
        />
        <Controls
          showInteractive={false}
          className="bg-card! border-border! shadow-none! [&>button]:bg-card! [&>button]:border-border! [&>button]:text-foreground! [&>button:hover]:bg-card-foreground!"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
};

export default HydraulicSystem;
