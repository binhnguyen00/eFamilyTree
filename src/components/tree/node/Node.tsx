import React from 'react';
import {  } from "zmp-ui";
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