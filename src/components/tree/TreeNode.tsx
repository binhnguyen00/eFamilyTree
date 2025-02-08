import React from 'react';

import { TreeUtils } from 'utils';
import { Node, ExtNode } from 'components/tree-relatives/types';

import { TreeConfig } from './TreeConfig';

interface TreeNodeProps {
  node: Node;
  displayField: string;
  isRoot: boolean;
  onSelectNode?: (node: ExtNode) => void;
}

export default React.memo<TreeNodeProps>(function TreeNode(props: TreeNodeProps) {
  const { node, displayField, isRoot, onSelectNode } = props;
  const nodeColor 
    = node.gender === "male" 
    ? TreeConfig.nodeMaleColor 
    : TreeConfig.nodeFemaleColor;

  const nodePosition = TreeUtils.calculateNodePosition(node as ExtNode);
  
  return (
    <div
      // Container
      id={`node-${node.id}`}
      className='svg-node button' // Singular purpose: Check FamilyTree.tsx, in the part where export svg
      style={{
        position: "absolute",
        width: TreeConfig.nodeWidth,
        height: TreeConfig.nodeHeight,
        padding: TreeConfig.nodePadding,
        ...nodePosition,
      }}
      onClick={() => onSelectNode?.(node as ExtNode)}
    >
      <p
        // Generation
        style={{
          background: `${nodeColor}`,
          height: "25%",
          color: "white",
        }}
        className='center'
      >
        {`Đời ${node.generation}`}
      </p>
      <div
        style={{
          background: "#FEF3E2",
          position: "relative",
          width: "100%", height: "75%",
          padding: "0.5rem 0",
        }}
      >
        <h3
          // Name
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
  )
})