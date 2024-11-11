import React from 'react';
import { PiTreeBold } from "react-icons/pi";
import { Box, Text } from "zmp-ui";

import "../../css/tree-node.scss"

export interface FamilyMember {
  id: string;
  name: string;
  gender: "male" | "female";
  img?: string;
  parents: { id: string; type: "blood" }[];
  siblings: { id: string; type: "blood" }[];
  spouses: { id: string; type: "married" }[];
  children: { id: string; type: "blood" }[];
}

interface NodeProps {
  node: FamilyMember;
  displayField: string;
  isRoot: boolean;
  onSelectNode: (id: string) => void;
  style?: React.CSSProperties;
}

function Node({node, displayField, isRoot, onSelectNode, style}: NodeProps) {
  return (
    <div className='tree-node' style={style}>
      <Box 
        flex justifyContent='center' alignItems='center'
        className={`tree-node-${node.gender} button`}
        onClick={() => onSelectNode(node.id)}
        style={{ width: "100%", height: "100%", border: "1px solid black" }}
      >
        {isRoot && <PiTreeBold size={"1em"}/>}
        <Text.Title size='small' style={{ color: "white" }}> {node[displayField]} </Text.Title>
      </Box>
    </div>
  )
}

export default Node;