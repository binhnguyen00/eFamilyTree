import React from 'react';
import type { ExtNode } from 'relatives-tree/lib/types';

import "../../../css/tree-node.scss"

interface NodeProps {
  node: ExtNode;
  isRoot: boolean;
  isHover?: boolean;
  onClick: (id: string) => void;
  onSubClick?: (id: string) => void;
  style?: React.CSSProperties;
}

export function Node({node, isRoot, isHover, onClick, onSubClick, style}: NodeProps) {
  const clickHandler = React.useCallback(() => onClick(node.id), [node.id, onClick]);
  // const clickSubHandler = React.useCallback(() => onSubClick(node.id), [node.id, onSubClick]);

  return (
    <div className='tree-node-root' style={style}>
      <div
        className={
          `tree-node-inner 
          ${node.gender} ${isRoot ? 'tree-node-is-root' : ''} 
          ${isHover ? 'tree-node-is-hover' : ''}`
        }
        onClick={clickHandler}
      >
        <div className='tree-node-id'> {node.id} </div>
        {/* TODO: sub tree here */}
      </div>
    </div>
  )
}