import { Position, ConnectionLineType } from "@xyflow/react";
import { layoutFromMap, TreeNode } from 'entitree-flex';

import { TreeConfig } from "./Config";

declare type TreeRel<T extends {}> = {
  virtualSource?: TreeNode<T>;
  source: TreeNode<T>;
  target: TreeNode<T>;
};

enum Orientation {
  VERTICAL   = 'vertical',
  HORIZONTAL = 'horizontal',
};

const ENTITREE_SETTINGS = {
  clone: true,                       // returns a copy of the input, if your application does not allow editing the original object
  enableFlex: false,                 // has slightly better perfomance if turned off (node.width, node.height will not be read)
  firstDegreeSpacing: 100,           // spacing in px between nodes belonging to the same source, eg children with same parent
  nextAfterAccessor: 'spouses',      // the side node prop used to go sideways, AFTER the current node
  nextAfterSpacing: 100,             // the spacing of the "side" nodes AFTER the current node
  nextBeforeAccessor: 'siblings',    // the side node prop used to go sideways, BEFORE the current node
  nextBeforeSpacing: 100,            // the spacing of the "side" nodes BEFORE the current node
  nodeHeight: TreeConfig.nodeHeight, // default node height in px
  nodeWidth: TreeConfig.nodeWidth,   // default node width in px
  orientation: Orientation.VERTICAL, // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
  rootX: 0,                          // set root position if other than 0
  rootY: 0,                          // set root position if other than 0
  secondDegreeSpacing: 100,          // spacing in px between nodes not belonging to same parent eg "cousin" nodes
  sourcesAccessor: 'parents',        // the prop used as the array of ancestors ids
  sourceTargetSpacing: 100,          // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
  targetsAccessor: 'children',       // the prop used as the array of children ids
};

const { Top, Bottom, Left, Right } = Position;

export function positioning(tree: any, rootId: number, direction = 'TB') {
  const isTreeHorizontal = direction === 'LR';

  const { nodes: entitreeNodes, rels: entitreeEdges } = layoutFromMap(
    rootId,
    tree,
    {
      ...ENTITREE_SETTINGS,
      orientation: isTreeHorizontal
        ? Orientation.HORIZONTAL
        : Orientation.VERTICAL,
    },
  );

  const nodes: TreeNode[] = new Array();
  const edges: any[] = new Array();

  entitreeEdges.forEach((edge: TreeRel<any>) => {
    const sourceNode = edge.source.id;
    const targetNode = edge.target.id;

    const newEdge = {} as any;

    newEdge.id = 'ed' + sourceNode + targetNode;
    newEdge.source = sourceNode;
    newEdge.target = targetNode;
    newEdge.type = ConnectionLineType.SmoothStep;
    newEdge.animated = false;

    // Check if target node is spouse or sibling
    const isTargetSpouse = !!edge.target.isSpouse;
    const isTargetSibling = !!edge.target.isSibling;

    if (isTargetSpouse) {
      newEdge.sourceHandle = isTreeHorizontal ? Bottom : Right;
      newEdge.targetHandle = isTreeHorizontal ? Top : Left;
    } else if (isTargetSibling) {
      newEdge.sourceHandle = isTreeHorizontal ? Top : Left;
      newEdge.targetHandle = isTreeHorizontal ? Bottom : Right;
    } else {
      newEdge.sourceHandle = isTreeHorizontal ? Right : Bottom;
      newEdge.targetHandle = isTreeHorizontal ? Left : Top;
    }

    edges.push(newEdge);
  });

  entitreeNodes.forEach((node: any) => {
    const newNode = {} as any;

    const isSpouse = !!node?.isSpouse;
    const isSibling = !!node?.isSibling;
    const isRoot = node?.id === rootId;

    if (isSpouse) {
      newNode.sourcePosition = isTreeHorizontal ? Bottom : Right;
      newNode.targetPosition = isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      newNode.sourcePosition = isTreeHorizontal ? Top : Left;
      newNode.targetPosition = isTreeHorizontal ? Bottom : Right;
    } else {
      newNode.sourcePosition = isTreeHorizontal ? Right : Bottom;
      newNode.targetPosition = isTreeHorizontal ? Left : Top;
    }

    newNode.data = { 
      label: node.name, 
      direction, 
      isRoot, 
      ...node 
    };
    newNode.id = node.id;
    newNode.width = TreeConfig.nodeWidth;
    newNode.height = TreeConfig.nodeHeight;
    newNode.type = 'node';
    newNode.animate = false

    newNode.position = {
      x: node.x,
      y: node.y,
    };

    nodes.push(newNode);
  });

  return { nodes, edges };
}