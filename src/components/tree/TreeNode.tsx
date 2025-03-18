import React from 'react';
import classNames from "classnames";

import { TreeUtils } from 'utils';
import { CommonIcon } from 'components/icon';
import { ExtNode } from 'components/tree-relatives/types';

import { TreeConfig } from './TreeConfig';
import css from "./css/TreeNode.module.css";

interface TreeNodeProps {
  node: ExtNode;
  isRoot: boolean;
  displayField: string;
  onSelectNode?: (node: ExtNode) => void;
  onSelectSubNode?: (node: ExtNode) => void;
}

export default React.memo<TreeNodeProps>(function TreeNode(props: TreeNodeProps) {
  const { node, displayField, isRoot } = props;
  let { onSelectNode, onSelectSubNode } = props;

  if (!onSelectNode) {
    onSelectNode = (node: ExtNode) => console.log("onSelectNode is not implemented");
  }

  if (!onSelectSubNode) {
    onSelectSubNode = (node: ExtNode) => console.log("onSelectSubNode is not implemented");
  }

  const nodeColor = {
    backgroundColor: node.gender === "male" ? TreeConfig.nodeMaleColor : TreeConfig.nodeFemaleColor
  } as React.CSSProperties; 

  const nodePosition = TreeUtils.calculateNodePosition(node);

  const nodeContainerCss = {
    position: "absolute",
    width: TreeConfig.nodeWidth,
    height: TreeConfig.nodeHeight,
    padding: TreeConfig.nodePadding,
    ...nodePosition,
  } as React.CSSProperties;

  const clickHandler = React.useCallback(() => onSelectNode(node), [node.id, onSelectNode]);
  const clickSubHandler = React.useCallback(() => onSelectSubNode(node), [node.id, onSelectSubNode]);

  return (
    <div
      key={node.id} id={`node-${node.id}`} style={nodeContainerCss}
      className='svg-node' // Singular purpose: Check FamilyTree.tsx, in the part where export svg
    >
      <p className={classNames(css.generation, "center", "rounded-top")} style={nodeColor}>
        {node.generation && `Đời ${node.generation}`}
      </p>
      <div className={classNames(css.node, css.button, "rounded-bottom")} onClick={clickHandler}>
        {node[displayField]}
      </div>
      {node.hasSubTree && (
        <div 
          className={classNames(css.subtree, css[node.gender], css.button, "rounded")}
          onClick={clickSubHandler}
        > <CommonIcon.Family size={24}/> </div>
      )}
    </div>
  )
})