import React from 'react';
import { Box, Modal, Text } from "zmp-ui";

import "../../../css/tree-node.scss"

interface NodeProps {
  node: any;
  isRoot: boolean;
  onClick: (id: string) => void;
  style?: React.CSSProperties;
}

export function Node({node, isRoot, onClick, style}: NodeProps) {
  const showDetails = () => {
    console.log(node);
    onClick(node.id);
  }

  return (
    <div className='tree-node-root' style={style}>
      <Box 
        flex justifyContent='center' alignItems='center'
        className={`tree-node-${node.gender}`}
        onClick={showDetails}
      >
        <Text.Title size='small'> {node.name} </Text.Title>
      </Box>
    </div>
  )
}