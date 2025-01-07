import React from 'react';
import { Node } from 'components/tree-relatives/types';
import { TreeUtils } from 'pages/family-tree/TreeUtils';

interface TreeNodeProps {
  node: Node;
  displayField: string;
  isRoot: boolean;
  onSelectNode: (id: string) => void;
}

export function TreeNode({ node, displayField, isRoot, onSelectNode }: TreeNodeProps) {
  const nodeColor = node.gender === "male" ? "#112D4E" : "#7D0A0A";
  const nodePosition = TreeUtils.calculateNodePosition(node as any);

  return (
    <div
      id={`node-${node.id}`}
      className='svg-node button' // Singular purpose: Check FamilyTree.tsx, in the part where export svg
      style={{
        ...nodePosition,
        position: "absolute",
        padding: 20,
        borderRadius: "0.5rem",
      }}
      onClick={() => onSelectNode(node.id)}
    >
      <div
        style={{
          background: `linear-gradient(to bottom, ${nodeColor} 25%, #FEF3E2 25%)`,
          color: `${nodeColor}`,
          borderRadius: "0.5rem",
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          padding: "0.5rem",
        }}
      >
        {/* This wrapper div acts as the ::before pseudo-element */}
        <div
          style={{
            content: "", // Acts as a pseudo-element
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "25%",
            background: nodeColor,
            borderRadius: "0.5rem",
            zIndex: 0, // Ensure it's behind other content
          }}
        />

        <img
          src={node.avatar && `http://${node.avatar}`}
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: "50%",
            zIndex: 1, // Ensure it appears above the background
          }}
        />

        {/* TODO: Traslate this */}
        <p>
          {`Đời ${node.generation}`}
        </p>

        <h3
          style={{
            color: "black",
            textAlign: "center",
            textTransform: "uppercase",
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            zIndex: 1, // Ensure text appears above the background
          }}
        >
          {node[displayField]}
        </h3>
      </div>
    </div>
  );
}