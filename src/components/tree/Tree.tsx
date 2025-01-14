import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Box } from 'zmp-ui';

import calcTree from 'components/tree-relatives';
import { ImageWithText } from "components";
import { ExtNode, Gender, Node, RelData } from 'components/tree-relatives/types';

import { useAppContext } from 'hooks';
import { CommonUtils, TreeDataProcessor } from 'utils';

import Connector from './TreeConnector';
import { TreeConfig } from './TreeConfig';
import { TreeSearchBar } from './TreeSearchBar';
import { TreeController } from './TreeController';

import "./css/transform-wrapper.scss";
import roll from "assets/img/tree/roll.png";

const initNode = { 
  id: "0", 
  gender: Gender.male, 
  name: "Thành Viên", 
  generation: 0, 
  parents: [], children: [], siblings: [], spouses: []
}

interface TreeProps {
  nodes: Node[];
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  renderNode: (node: any) => React.ReactNode;
  onReset?: () => void;
  className?: string;
  searchFields?: string[];
  searchDisplayField?: string;
  processor?: TreeDataProcessor;
}

export default React.memo<TreeProps>(function Tree(props) {
  const { 
    rootId = "0", 
    searchFields = [ "id" ], 
    nodes = [ initNode as Node ],
    processor, nodeWidth, nodeHeight, searchDisplayField, renderNode, onReset
  } = props;

  const data = calcTree(nodes, { rootId: rootId });
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
        minScale={0.1}
        centerOnInit
        centerZoomedOut
      >
        {({ zoomIn, zoomOut, zoomToElement }) => {
          return (
            <React.Fragment>
              <Box flex flexDirection='row' justifyContent='space-between'>
                <TreeSearchBar 
                  searchFields={searchFields}
                  displayField={searchDisplayField}
                  nodes={nodes}
                  onSelect={zoomToElement}
                />
                <TreeController
                  rootId={rootId}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onZoomToRoot={zoomToElement}
                  html2export={{
                    content: (                
                      <TreeContainer 
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
              </Box>
              <TransformComponent>
                <TreeContainer 
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
    calculatedData, treeRef, backgroundPath, rootId, 
    renderNode, zoomToRoot, processor
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

  React.useEffect(() => {
    if (!treeRef.current || !zoomToRoot) return;
    
    const root = document.querySelector<HTMLDivElement>(`#node-${rootId}`);

    const checkRender = () => {
      if (root) {
        zoomToRoot(root, 2);
      } else {
        requestAnimationFrame(checkRender); // Keep checking until rendered
      }
    };

    requestAnimationFrame(checkRender);
  }, [ ]);

  return (
    <div
      id="tree-canvas"
      ref={treeRef}
      className={`border-primary rounded ${props.className ? props.className : ""}`}
      style={{
        width: calculatedData.nodes.length > 10 ? treeWidth : 1000,
        height: calculatedData.nodes.length > 10 ? treeHeight + 200 : 1000, 
        ...handleBackground(),
      }}
    >
      <NodeAndConnector 
        rootId={rootId}
        calculatedData={calculatedData}
        connectorHeight={connectorHeight}
        connectorWidth={connectorWidth}
        renderNode={renderNode}
      />
    </div>
  )
}

interface NodeAndConntectorProps {
  rootId: string,
  calculatedData: RelData, 
  connectorWidth: number,
  connectorHeight: number,
  renderNode: (node: any) => React.ReactNode,
}
function NodeAndConnector(props: NodeAndConntectorProps) {
  const { calculatedData, connectorHeight, connectorWidth, renderNode, rootId } = props;
  const root = calculatedData.nodes.find(node => node.id === rootId);
  const { left, top } = root as ExtNode;
  const width = TreeConfig.nodeWidth / 2;

  return (
    <>
      <div 
        className='text-center'
        style={{
          zIndex: 9999,
          width: 680,
          height: TreeConfig.nodeHeight,
          transform: `translate(${(left * width) - (root?.spouses.length ? 680 / 3 : 680 / 2.5 )}px, 10px)`
        }}
      >
        <ImageWithText 
          src={roll} text={"Họ Nguyễn"}  
          textStyle={{ fontSize: "3rem"}}      
          width={680} 
          height={TreeConfig.nodeHeight}
        />
      </div>
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