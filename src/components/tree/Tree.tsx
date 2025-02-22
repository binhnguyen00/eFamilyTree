import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import calcTree from 'components/tree-relatives';
import { ExtNode, Gender, Node, RelData } from 'components/tree-relatives/types';

import { useAppContext } from 'hooks';
import { CommonUtils, TreeDataProcessor } from 'utils';

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
  renderNode: (node: any) => React.ReactNode;
  className?: string;
  processor?: TreeDataProcessor;
  zoomElement?: HTMLElement;
  searchDisplayField?: string;
  onReset?: () => void;
}

export default React.memo<TreeProps>(function Tree(props) {
  const { userInfo } = useAppContext();
  const { 
    rootId = "0", 
    nodes = [],
    processor, nodeWidth, nodeHeight, searchDisplayField, 
    renderNode, onReset, zoomElement
  } = props;

  let data: any;
  if (nodes.length === 0) {
    data = {
      families: [],
      canvas: [],
      nodes: [],
      connectors: [],
    }
  } else {
    data = calcTree(nodes, { rootId: rootId });
  } 

  const treeWidth = data.canvas.width * (nodeWidth / 2);
  const treeHeight = data.canvas.height * (nodeHeight / 2);
  const treeRef = React.useRef<HTMLDivElement | null>(null);
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
                  displayField={searchDisplayField}
                  nodes={nodes}
                  onSelect={zoomToElement}
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
                        calculatedData={data}
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
                  calculatedData={data}
                  renderNode={renderNode}
                  zoomToRoot={zoomToElement}
                  backgroundPath={treeBackgroundPath}
                  processor={processor}
                />
              </TransformComponent>
            </React.Fragment>
          )
        }}
      </TransformWrapper>
    </div>
  );
});

interface TreeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string; // Clan Name
  treeRef: any;
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  calculatedData: RelData;
  backgroundPath: string;
  renderNode: (node: any) => React.ReactNode;
  zoomToRoot?: (root: HTMLElement, scale?: number) => void;
  processor?: TreeDataProcessor;
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
          width: treeWidth + TreeConfig.headerHeight,
          height: treeHeight + TreeConfig.headerHeight, 
          ...handleBackground(),
        }}
      >
        <TreeHeader 
          title={title}
          rootNode={root as ExtNode} 
        />
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
  renderNode: (node: any) => React.ReactNode,
}
function NodeAndConnector(props: NodeAndConntectorProps) {
  const { calculatedData, connectorHeight, connectorWidth, renderNode } = props;

  const node = {
    id: "1",
    gender: Gender.male,
    name: "Thuỷ tổ",
    children: [],
    parents: [],
    spouses: [],
    siblings: [],
    generation: 1,
  }

  if (!calculatedData.nodes.length) {
    return;
    // Debug
    // return renderNode(node)
  }

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