import React from 'react';
import type { ExtNode } from 'relatives-tree/lib/types';

import "../../../css/tree-node.scss"

interface NodeProps {
  node: ExtNode;
  isRoot: boolean;
  onClick: (id: string) => void;
  style?: React.CSSProperties;
}

export function Node({node, isRoot, onClick, style}: NodeProps) {
  const showDetails = () => {
    console.log(node);
  }

  return (
    <div className='tree-node-root' style={style}>
      <div
        className={`tree-node-inner tree-node-${node.gender}`}
        onClick={showDetails}
      >
        <div className='tree-node-id'> {node.id} </div>
      </div>
    </div>
  )
}