import React from 'react';
import { Avatar, Stack, Text } from "zmp-ui";

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
        className={`tree-node-${node.gender} p-2 border center`}
        style={nodeStyle}
      >
        <Avatar size={60} src={node.avatar ? `http://${node.avatar}` : undefined} className='m-2'/>
        <Text.Title size='xLarge' classID='text-uppercase text-center text-warp'> 
          {node[displayField]} 
        </Text.Title>
      </Stack>
    </div>
  )
}

export default TreeNode;