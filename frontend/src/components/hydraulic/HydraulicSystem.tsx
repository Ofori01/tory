import React, { useMemo } from "react";
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
import { createInitialNodes, createInitialEdges } from "./config";

/** Register custom node types once (outside render) */
const nodeTypes: NodeTypes = {
  hydraulicNode: HydraulicNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

/**
 * The main Hydraulic System flow diagram.
 */
const HydraulicSystem: React.FC = () => {
  const nodes = useMemo(() => createInitialNodes(), []);
  const edges = useMemo(() => createInitialEdges(), []);

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
