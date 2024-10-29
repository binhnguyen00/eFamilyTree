import React, { useMemo, useState } from "react";
import { Page } from "zmp-ui";
import ReactFamilyTree from 'react-family-tree';
import { ExtNode } from "relatives-tree/lib/types";
import { Node } from "components/tree/node/Node";
import members from "../family-tree/demo-member.json";
import { CommonComponentUtils } from "utils/CommonComponent";

export const NODE_WIDTH = 70;
export const NODE_HEIGHT = 80;

export function UITree() {
  const [nodes, setNodes] = useState(members);
  const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
  const [rootId, setRootId] = useState(firstNodeId);
  const [selectId, setSelectId] = useState<string>();

  return (
    <>
      {CommonComponentUtils.renderHeader("Demo Tree")}

      {nodes.length > 0 ? (
        <div className="scrollable zoomable">
          <ReactFamilyTree
            nodes={nodes as any}
            rootId={rootId}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            renderNode={(node: Readonly<ExtNode>) => (
              <Node
                key={node.id}
                node={node}
                isRoot={node.id === rootId}
                onClick={setSelectId}
                style={getNodeStyle(node)}
              />
            )}
          />
        </div>
      ): (
        <div> Getting members... </div>
      )}
    </>
  );
}

export function getNodeStyle({ left, top }: Readonly<ExtNode>): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}