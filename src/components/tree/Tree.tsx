import React from 'react';
import calculateTree from 'components/tree-relatives';
import { ExtNode, Node, RelData } from 'components/tree-relatives/types';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useAppContext } from 'hooks';
import { CommonUtils } from 'utils';

import Connector from './TreeConnector';
import { TreeConfig } from './TreeConfig';
import { TreeHeader } from './TreeHeader';
import { TreeSearchBar } from './TreeSearchBar';
import { TreeController } from './TreeController';

import "./css/transform-wrapper.scss";

interface TreeProps {
  nodes: Node[];
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  renderNode: (node: ExtNode) => React.ReactNode;
  className?: string;
  zoomElement?: HTMLElement;
  onReset?: () => void;
  searchDisplayField?: string;
}

export function Tree(props: TreeProps) {
  const { userInfo } = useAppContext();
  const { 
    rootId = "0", 
    nodes = [], nodeWidth, nodeHeight, 
    renderNode, onReset, zoomElement, searchDisplayField
  } = props;

  const calcTree: RelData = React.useMemo(() => {
    if (nodes.length === 0) {
      return {
        families: [],
        canvas: [],
        nodes: [],
        connectors: [],
      }
    }
    return calculateTree(nodes, { rootId: rootId });
  }, [ nodes, rootId ]);

  const treeWidth   = calcTree.canvas.width * (nodeWidth / 2);
  const treeHeight  = calcTree.canvas.height * (nodeHeight / 2);
  const treeRef     = React.useRef<HTMLDivElement | null>(null);
  const { treeBackgroundPath } = useAppContext();

  return (
    <div 
      style={{ // Tree needs to know it's w & h or the pinch-zoom-pan would be buggy.
        width: window.innerWidth,
        height: TreeConfig.treeHeight,
      }}
    >
      <TransformWrapper 
        initialScale={0.5}
        minScale={0.01}
        smooth
        centerZoomedOut
      >
        {({ zoomIn, zoomOut, zoomToElement }) => {
          return (
            <React.Fragment>
              <div className='flex-h justify-between'>
                <TreeSearchBar 
                  nodes={nodes}
                  onSelect={zoomToElement}
                  displayField={searchDisplayField}
                  style={{
                    position: "absolute",
                    zIndex: 8888
                  }}
                />
                <TreeController
                  zoomElement={zoomElement}
                  rootId={rootId}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onZoomToRoot={zoomToElement}
                  html2export={{
                    content: (                
                      <TreeContainer 
                        title={userInfo.clanName}
                        rootId={rootId}
                        treeRef={treeRef}
                        nodeWidth={nodeWidth}
                        nodeHeight={nodeHeight}
                        calculatedData={calcTree}
                        renderNode={renderNode}
                        backgroundPath={treeBackgroundPath}
                      />
                    ),
                    width: treeWidth,
                    height: treeHeight,
                  }}
                  onReset={onReset}
                />
              </div>
              <TransformComponent>
                <TreeContainer 
                  title={userInfo.clanName}
                  rootId={rootId}
                  treeRef={treeRef}
                  nodeWidth={nodeWidth}
                  nodeHeight={nodeHeight}
                  calculatedData={calcTree}
                  renderNode={renderNode}
                  zoomToRoot={zoomToElement}
                  backgroundPath={treeBackgroundPath}
                />
              </TransformComponent>
            </React.Fragment>
          )
        }}
      </TransformWrapper>
    </div>
  )
}

interface TreeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string; // Clan Name
  treeRef: any;
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  calculatedData: RelData;
  backgroundPath: string;
  renderNode: (node: ExtNode) => React.ReactNode;
  zoomToRoot?: (root: HTMLElement, scale?: number) => void;
}
function TreeContainer(props: TreeContainerProps) {
  const { 
    calculatedData, treeRef, backgroundPath, rootId, title,
    renderNode, zoomToRoot
  } = props;

  const handleBackground = () => {
    let background = {
      backgroundColor: `var(--tree-background-color)`
    } as React.CSSProperties;
    if (!CommonUtils.isStringEmpty(backgroundPath)) {
      background = {
        backgroundImage: `url(${backgroundPath})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      };
    }
    return background;
  }

  const connectorWidth = props.nodeWidth / 2;
  const connectorHeight = props.nodeHeight / 2;
  const treeWidth = calculatedData.canvas.width * connectorWidth;
  const treeHeight = calculatedData.canvas.height * connectorHeight;

  // keep trying to zoom to root until TreeContainer is rendered
  React.useEffect(() => {
    if (!treeRef.current || !zoomToRoot) return;
    const root = document.querySelector<HTMLDivElement>(`#node-${rootId}`);
    const checkRender = () => {
      if (root) {
        zoomToRoot(root, 2);
      } else {
        requestAnimationFrame(checkRender);
      }
    };
    requestAnimationFrame(checkRender);
  }, [ ]);

  const root = calculatedData.nodes.find(node => node.id === rootId);
  return (
    <>
      <div
        id="tree-canvas"
        ref={treeRef}
        className={`rounded ${props.className ? props.className : ""}`}
        style={{
          width: treeWidth,
          height: treeHeight + TreeConfig.headerHeight, 
          ...handleBackground(),
        }}
      >
        <TreeHeader 
          title={title}
          rootNode={root as ExtNode} 
        />

        <br/><br/><br/><br/><br/>

        <NodeAndConnector 
          calculatedData={calculatedData}
          connectorHeight={connectorHeight}
          connectorWidth={connectorWidth}
          renderNode={renderNode}
        />
      </div>
    </>
  )
}

interface NodeAndConntectorProps {
  calculatedData: RelData, 
  connectorWidth: number,
  connectorHeight: number,
  renderNode: (node: ExtNode) => React.ReactNode,
}
function NodeAndConnector(props: NodeAndConntectorProps) {
  const { calculatedData, connectorHeight, connectorWidth, renderNode } = props;

  if (!calculatedData.nodes.length) return;

  return (
    <>
      {calculatedData.connectors.map((connector, idx) => (
        <Connector
          key={idx}
          connector={connector}
          width={connectorWidth}
          height={connectorHeight}
        />
      ))}
      {calculatedData.nodes.map((node, idx) => {
        return renderNode(node)
      })}
    </>
  )
}