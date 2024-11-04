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
  isRoot: boolean;
  onSelectNode: (id: string) => void;
  style?: React.CSSProperties;
}

export function Node({node, isRoot, onSelectNode, style}: NodeProps) {
  const showDetails = () => {
    console.log(node);
    onSelectNode(node.id);
  }

  return (
    <div className='tree-node' style={style}>
      <Box 
        flex justifyContent='center' alignItems='center'
        className={`tree-node-${node.gender} button`}
        onClick={showDetails}
        style={{ width: "100%", height: "100%", border: "1px solid black" }}
      >
        {isRoot && <PiTreeBold size={"1em"}/>}
        <Text.Title size='small' style={{ color: "white" }}> {node.name} </Text.Title>
      </Box>
    </div>
  )
}