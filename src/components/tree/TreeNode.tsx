import React from 'react';
import { Node } from 'components/tree-relatives/types';
import { TreeUtils } from 'pages/family-tree/TreeUtils';
import { styled } from "styled-components";

interface TreeNodeProps {
  node: Node;
  displayField: string;
  isRoot: boolean;
  onSelectNode: (id: string) => void;
}

const StyledNode = styled.div<{ nodeColor: string }>`
  position: relative;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
  padding: 0.5rem;
  width: 100%; 
  height: 100%; 
  background: ${({ nodeColor }) => `linear-gradient(to bottom, ${nodeColor} 25%, #FEF3E2 25%)`};
  color: ${({ nodeColor }) => nodeColor};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 25%;
    background: ${({ nodeColor }) => nodeColor};
    border-radius: 0.5rem;
  }
`;

export function TreeNode({node, displayField, isRoot, onSelectNode}: TreeNodeProps) {
  const nodeColor = (node.gender === "male") ? "#112D4E" : "#7D0A0A";
  const nodePosition = TreeUtils.calculateNodePosition(node as any);

  return (
    <div 
      id={`node-${node.id}`} 
      style={{
        ...nodePosition,
        position: "absolute",
        padding: 20,
        borderRadius: "0.5rem"
      }} 
      onClick={() => onSelectNode(node.id)}
    >
      <StyledNode nodeColor={nodeColor}>
        <img // Avatar
          src={node.avatar && `http://${node.avatar}`} 
          style={{
            width: 80, 
            height: 80,
            objectFit: "cover",
            borderRadius: "50%",
            zIndex: 999
          }}
        />
        <h3 // Name
          style={{ 
            color: "black",
            textAlign: "center",
            textTransform: "uppercase",
            whiteSpace: "normal",     
            wordWrap: "break-word", 
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}> 
            {node[displayField]} 
        </h3>
      </StyledNode>
    </div>
  )
}