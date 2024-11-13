import React from 'react';
import { Avatar, Box, Stack, Text } from "zmp-ui";

import "css/tree-node.scss"

export interface FamilyMember {
  id: string;
  name: string;
  gender: "male" | "female";
  avatar?: string;
  parents: { id: string; type: "blood" }[];
  siblings: { id: string; type: "blood" }[];
  spouses: { id: string; type: "married" }[];
  children: { id: string; type: "blood" }[];
}

interface TreeNodeProps {
  node: FamilyMember;
  displayField: string;
  isRoot: boolean;
  onSelectNode: (id: string) => void;
  style?: React.CSSProperties;
}

function TreeNode({node, displayField, isRoot, onSelectNode, style}: TreeNodeProps) {
  const nodeStyle = { 
    width: "100%", 
    height: "100%", 
  };
  return (
    <div className='tree-node' style={style} onClick={() => onSelectNode(node.id)}>
      <Stack
        className={`tree-node-${node.gender} button p-1 border center`}
        style={nodeStyle}
      >
        <Avatar size={60} src={node.avatar || undefined} className='m-2'/>
        <Text.Title size='small' style={{ color: "white", textAlign: "center" }}> 
          {node[displayField]} 
        </Text.Title>
      </Stack>
    </div>
  )
}

export default TreeNode;