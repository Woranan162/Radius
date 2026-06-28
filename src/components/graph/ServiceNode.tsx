"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export type ServiceNodeData = {
  label: string;
  tier: string;
  weight: number;
  status: "healthy" | "failed" | "affected";
};

function ServiceNodeComponent({ data }: NodeProps) {
  const d = data as ServiceNodeData;
  const isFailed = d.status === "failed";
  const isAffected = d.status === "affected";

  return (
    <div
      className="service-node-card"
      style={{
        width: 150,
        minHeight: 58,
        borderRadius: 6,
        padding: "8px 12px",
        border: isFailed
          ? "1px solid #eb5757"
          : isAffected
            ? "1px solid #d9730d"
            : "1px solid rgba(55, 53, 47, 0.16)",
        background: isFailed ? "#fdebec" : isAffected ? "#fbf3db" : "#ffffff",
        boxShadow: "0 1px 2px rgba(55, 53, 47, 0.08)",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontSize: 13, fontWeight: 600, color: "#37352f", lineHeight: 1.3 }}>
        {d.label}
      </div>
      <div style={{ fontSize: 11, color: "#787774", marginTop: 4 }}>
        {d.tier} · w{d.weight}
        {isFailed && (
          <span style={{ marginLeft: 6, fontWeight: 600, color: "#eb5757" }}>· down</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const ServiceNode = memo(ServiceNodeComponent);
export default ServiceNode;