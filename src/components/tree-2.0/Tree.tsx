import React from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Node from "./Node";
import ConnectionLine from "./ConnectionLine";

import { positioning } from "./Positioning";
import { initialTree, treeRootId } from "./Init";
import { animated } from '@react-spring/web';

const { nodes: layoutedNodes, edges: layoutedEdges } = positioning(
  initialTree,
  treeRootId,
  'TB',
);

interface TreeProps {
  className?: string;
}
export function Tree(props: TreeProps) {
  let {  } = props;

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes as any[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = React.useCallback(
    (params: any) => setEdges((eds) => addEdge({...params, type: ConnectionLineType.Bezier}, eds)),
    [ setEdges ], 
  );

  const onLayout = React.useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = positioning(
        initialTree,
        treeRootId,
        direction,
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      connectionLineType={ConnectionLineType.Bezier}
      connectionLineComponent={ConnectionLine}
      connectionMode={ConnectionMode.Strict}
      nodeTypes={{
        node: Node,
      }}
      nodesConnectable={false}
      defaultEdgeOptions={{
        animated: false,
        selectable: false,
        style: { 
          stroke: 'black', 
          strokeWidth: 1.5,
          strokeDashoffset: 0
        },
      }}
      style={{ backgroundColor: "white"}}
    >
      <Panel position="top-right">
        <button onClick={() => onLayout('TB')}> Vertical </button>
        <button onClick={() => onLayout('LR')}> Horizontal </button>
      </Panel>
      <Controls/>
      <Background variant={BackgroundVariant.Dots}/>
    </ReactFlow>
  );
}