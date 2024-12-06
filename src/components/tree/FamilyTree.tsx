import React from 'react';

import calcTree from 'components/tree-relatives';
import Connector from './Connector';
import { Gender, Node } from 'components/tree-relatives/types';

import { TreeNode, TreeConfig } from 'components';
import { useGesture } from "@use-gesture/react";

interface Props {
  nodes: ReadonlyArray<Node>;
  rootId: string;
  width: number;
  height: number;
  placeholders?: boolean;
  className?: string;
  renderNode: (node: any) => React.ReactNode;
}

export default React.memo<Props>(function FamilyTree(props) {
  if (props.nodes.length === 0) return (
    <TreeNode 
      node={{
        name: "text", id: "", gender: Gender.male, avatar: "",
        parents: [], siblings: [], spouses: [], children: []
      }} 
      displayField="" 
      isRoot={true} 
      onSelectNode={() => {}} 
      style={{
        width: (TreeConfig.nodeWidth),
        height: (TreeConfig.nodeHeight),
      }}
    />
  );

  const data = calcTree(
    props.nodes, 
    {
      rootId: props.rootId,
      placeholders: props.placeholders,
    }
  );

  const width = props.width / 2;
  const height = props.height / 2;

  let [ crop, setCrop ] = React.useState({ x: 0, y: 0, scale: 1 });
  let ref = React.useRef<HTMLDivElement | null>(null);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setCrop((crop) => ({ ...crop, x: dx, y: dy }));
      },
      onPinch: ({ offset: [d] }) => {
        setCrop((crop) => ({ ...crop, scale: d }));
      },
    }, 
    {
      target: ref,
      eventOptions: {
        passive: false,
      },
    }
  ) 

  return (
    <>
      <div>
        <p> X: {crop.x} </p>
        <p> Y: {crop.y} </p>
      </div>
      <div
        ref={ref}
        className={props.className}
        style={{
          position: 'relative',
          width: data.canvas.width * width,
          height: data.canvas.height * height,

          left: crop.x,
          top: crop.y,
          transform: `scale(${crop.scale})`,
          touchAction: "none",
        }}
      >
        {data.connectors.map((connector, idx) => (
          <Connector
            key={idx}
            connector={connector}
            width={width}
            height={height}
          />
        ))}
        {data.nodes.map(props.renderNode)}
      </div>
    </>
  );
});