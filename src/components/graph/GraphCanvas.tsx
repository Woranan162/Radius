"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  useNodesInitialized,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { ServiceNodeData } from "./ServiceNode";

type GraphCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  onNodeClick: (event: unknown, node: Node) => void;
  showMinimap?: boolean;
  isDesktop?: boolean;
};

function GraphCanvasInner({
  nodes: nodesProp,
  edges: edgesProp,
  nodeTypes,
  onNodeClick,
  showMinimap,
  isDesktop,
}: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesProp);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesProp);
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    setNodes(nodesProp);
  }, [nodesProp, setNodes]);

  useEffect(() => {
    setEdges(edgesProp);
  }, [edgesProp, setEdges]);

  const runFitView = useCallback(
    (instance?: ReactFlowInstance) => {
      const fn = instance?.fitView ?? fitView;
      requestAnimationFrame(() => {
        fn({ padding: 0.2, duration: 200 });
      });
    },
    [fitView],
  );

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      runFitView(instance);
      setTimeout(() => runFitView(instance), 150);
    },
    [runFitView],
  );

  const nodeSignature = useMemo(
    () => nodesProp.map((n) => n.id).join(","),
    [nodesProp],
  );

  useEffect(() => {
    if (nodesInitialized) {
      runFitView();
    }
  }, [nodesInitialized, nodeSignature, runFitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onInit={onInit}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      minZoom={0.2}
      maxZoom={2}
      panOnScroll={isDesktop}
      zoomOnPinch
      panOnDrag
      onError={(code, message) => console.error("[ReactFlow]", code, message)}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="rgba(55, 53, 47, 0.1)"
      />
      <Controls
        showInteractive={false}
        position={isDesktop ? "top-left" : "bottom-left"}
        className="graph-zoom-controls"
      />
      {showMinimap && (
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const s = (n.data as ServiceNodeData).status;
            if (s === "failed") return "#eb5757";
            if (s === "affected") return "#d9730d";
            return "#c4c4c2";
          }}
          maskColor="rgba(255, 255, 255, 0.8)"
        />
      )}
    </ReactFlow>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <div className="graph-canvas-host">
      <ReactFlowProvider>
        <GraphCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
