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
  let { onSelectNode, onSelectSubNode } = props;
  const { node, displayField, isRoot } = props;
  const isMale = node.gender === "male";
  const isDead = !node.isAlive;

  if (!onSelectNode) {
    onSelectNode = (node: ExtNode) => console.log("onSelectNode is not implemented");
  }

  if (!onSelectSubNode) {
    onSelectSubNode = (node: ExtNode) => console.log("onSelectSubNode is not implemented");
  }

  const clickHandler = React.useCallback(() => onSelectNode(node), [node.id, onSelectNode]);
  const clickSubHandler = React.useCallback(() => onSelectSubNode(node), [node.id, onSelectSubNode]);

  const nodePosition = TreeUtils.calculateNodePosition(node);
  const nodeColor = {
    backgroundColor: isMale ? TreeConfig.nodeMaleColor : TreeConfig.nodeFemaleColor
  } as React.CSSProperties;
  const generationCss = {
    height: "25%",
    color: "white",
    backgroundColor: isMale ? TreeConfig.nodeMaleColor : TreeConfig.nodeFemaleColor
  } as React.CSSProperties;
  const nodeBodyCss = {
    color: "black",
    textAlign: "center",
    textTransform: "uppercase",
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    zIndex: 1,
    background: "#FEF3E2",
    position: "relative",
    width: "100%",
    height: "75%",
    padding: "0.5rem 0"
  } as React.CSSProperties;
  const subtreeCss = {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: "fit-content",
    padding: "0.1rem 0.5rem",
    zIndex: 999,
    color: "white",
    backgroundColor: isMale ? TreeConfig.nodeFemaleColor : TreeConfig.nodeMaleColor,
  } as React.CSSProperties;
  const nodeDeadCss = {
    position: "absolute",
    top: 3,
    right: 3,
    width: "fit-content",
    padding: 5,
    zIndex: 999,
    color: "white",
    backgroundColor: "black",
    borderRadius: "50%"
  } as React.CSSProperties;
  const nodeContainerCss = {
    position: "absolute",
    width: TreeConfig.nodeWidth,
    height: TreeConfig.nodeHeight,
    padding: TreeConfig.nodePadding,
    ...nodePosition,
  } as React.CSSProperties;
  const buttonCss = {
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "capitalize",
    fontWeight: "bolder",
  } as React.CSSProperties;

  return (
    <div 
      key={node.id} id={`node-${node.id}`} style={nodeContainerCss} 
      className='svg-node' // Singular purpose: Check FamilyTree.tsx, in the part where export svg
    >
      <p className={"rounded-top center"} style={{...generationCss, ...nodeColor}}>
        {node.generation && `Đời ${node.generation}`}
      </p>
      <div className={classNames(css.button, "rounded-bottom")} style={{...nodeBodyCss, ...buttonCss}} onClick={clickHandler}>
        {node[displayField]}
      </div>
      {node.hasSubTree && (
        <div className={classNames(css.button, "rounded")} style={subtreeCss} onClick={clickSubHandler}> 
          <CommonIcon.Family size={24}/> 
        </div>
      )}
      {!node.isAlive && (
        <div style={nodeDeadCss}>
          <CommonIcon.Grave size={20}/>
        </div>
      )}
    </div>
  )
})