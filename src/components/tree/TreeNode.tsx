import React from 'react';
import classNames from "classnames";

import { TreeUtils } from 'utils';
import { ExtNode } from 'components/tree-relatives/types';
import { TreeConfig } from './TreeConfig';

import css from "./css/TreeNode.module.css";
import { CommonIcon } from 'components/icon';

interface TreeNodeProps {
  node: ExtNode;
  isRoot: boolean;
  displayField: string;
  onSelectNode?: (node: ExtNode) => void;
}

export default React.memo<TreeNodeProps>(function TreeNode(props: TreeNodeProps) {
  const { node, displayField, isRoot } = props;
  let { onSelectNode } = props;

  const nodeColor = {
    backgroundColor: node.gender === "male" ? TreeConfig.nodeMaleColor : TreeConfig.nodeFemaleColor
  } as React.CSSProperties; 

  const nodePosition = TreeUtils.calculateNodePosition(node as ExtNode);

  const nodeContainerCss = {
    position: "absolute",
    width: TreeConfig.nodeWidth,
    height: TreeConfig.nodeHeight,
    padding: TreeConfig.nodePadding,
    ...nodePosition,
  } as React.CSSProperties;

  if (!onSelectNode) {
    onSelectNode = (node: ExtNode) => console.log("onSelectNode is not implemented");
  }

  return (
    <div
      id={`node-${node.id}`}
      className='svg-node' // Singular purpose: Check FamilyTree.tsx, in the part where export svg
      style={nodeContainerCss}
      onClick={() => onSelectNode(node as ExtNode)}
    >
      <p className={classNames(css.generation, "center")} style={nodeColor}>
        {node.generation && `Đời ${node.generation}`}
      </p>
      <div className={classNames(css.node, css.button)}>
        {node[displayField]}
      </div>
      {node.hasSubTree && (
        <div className={classNames(css.subtree, css[node.gender], css.button, "rounded")}>
          <CommonIcon.Tree size={24}/>
        </div>
      )}
    </div>
  )
})