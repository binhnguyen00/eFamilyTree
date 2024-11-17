import React from 'react';

import { TreeNode, TreeConfig } from 'components';
import calcTree from 'components/tree-relatives';
import { Gender, Node } from 'components/tree-relatives/types';

import Connector from './Connector';

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