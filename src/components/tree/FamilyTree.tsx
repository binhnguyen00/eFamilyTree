import React from 'react';
import calcTree from 'relatives-tree';
import Connector from './Connector';
import { Node } from 'relatives-tree/lib/types';
import TreeNode from 'components/node/TreeNode';
import { NODE_HEIGHT, NODE_WIDTH } from 'utils/FamilyTreeUtils';

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
        name: "text", id: "", gender: "male", avatar: "",
        parents: [], siblings: [], spouses: [], children: []
      }} 
      displayField="" 
      isRoot={true} 
      onSelectNode={() => {}} 
      style={{
        width: (NODE_WIDTH),
        height: (NODE_HEIGHT)
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

  return (
    <div
      className={props.className}
      style={{
        position: 'relative',
        width: data.canvas.width * width,
        height: data.canvas.height * height,
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
  );
});