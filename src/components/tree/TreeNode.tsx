import React from 'react';

import { Node, ExtNode } from 'components/tree-relatives/types';
import { TreeUtils } from 'utils';

import { TreeConfig } from './TreeConfig';

interface TreeNodeProps {
  node: Node;
  displayField: string;
  isRoot: boolean;
  onSelectNode: (id: string) => void;
}

export function TreeNode(props: TreeNodeProps) {
  const { node, displayField, isRoot, onSelectNode } = props;
  const nodeColor = node.gender === "male" ? TreeConfig.nodeMaleColor : TreeConfig.nodeFemaleColor;
  const nodePosition = TreeUtils.calculateNodePosition(node as ExtNode);

  return (
    <div
      id={`node-${node.id}`}
      className='svg-node button' // Singular purpose: Check FamilyTree.tsx, in the part where export svg
      style={{
        position: "absolute",
        width: TreeConfig.nodeWidth,
        height: TreeConfig.nodeHeight,
        padding: TreeConfig.nodePadding,
        ...nodePosition,
      }}
      onClick={() => onSelectNode(node.id)}
    >
      <div
        style={{
          background: `linear-gradient(to bottom, ${nodeColor} 25%, #FEF3E2 25%)`,
          color: `${nodeColor}`,
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
            zIndex: 0, // Ensure it's behind other content
          }}
        />

        {/* <img
          src={node.avatar && `http://${node.avatar}`}
          style={{
            width: 60,
            height: 60,
            objectFit: "cover",
            borderRadius: "50%",
            zIndex: 1, // Ensure it appears above the background
          }}
        /> */}

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

        {/* TODO: Traslate this */}
        <p>
          {`Đời ${node.generation}`}
        </p>

      </div>
    </div>
  );
}