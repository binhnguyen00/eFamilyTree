import React from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Node from "./Node";
import { positioning } from "./Positioning";
import { initialTree, treeRootId } from "./Init";

const nodeTypes = {
  custom: Node,
}

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
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );

  const onLayout = React.useCallback(
    (direction) => {
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
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      nodeTypes={nodeTypes}
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Panel position="top-right">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </Panel>
      <Background />
    </ReactFlow>
  );
}