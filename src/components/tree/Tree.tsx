import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Box } from 'zmp-ui';

import calcTree from 'components/tree-relatives';
import { Gender, Node } from 'components/tree-relatives/types';

import { useAppContext } from 'hooks';
import { CommonUtils } from 'utils';

import Connector from './TreeConnector';
import { TreeConfig } from './TreeConfig';
import { TreeSearchBar } from './TreeSearchBar';
import { TreeController } from './TreeController';

import "./css/transform-wrapper.scss";

interface TreeProps {
  nodes: Node[];
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  renderNode: (node: any) => React.ReactNode;
  placeholders?: boolean;
  className?: string;
  searchFields?: string[];
  searchDisplayField?: string;
  onReset?: () => void;
}

export default React.memo<TreeProps>(function Tree(props) {
  let { searchFields = [ "id" ], nodes, rootId } = props;

  if (!nodes.length || !rootId) {
    nodes = [{
      id: "0",
      gender: Gender.male,
      name: "Thành Viên",
      parents: [],
      children: [],
      siblings: [],
      spouses: []
    }]
    rootId = "0";
  }


  let data = calcTree(
    props.nodes, 
    {
      rootId: props.rootId,
      placeholders: props.placeholders,
    }
  );

  const nodeWidth = props.nodeWidth / 2;
  const nodeHeight = props.nodeHeight / 2;
  const treeWidth = data.canvas.width * nodeWidth;
  const treeHeight = data.canvas.height * nodeHeight;
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
                  displayField={props.searchDisplayField}
                  nodes={props.nodes}
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
                        renderNode={props.renderNode}
                        backgroundPath={treeBackgroundPath}
                      />
                    ),
                    width: treeWidth,
                    height: treeHeight,
                  }}
                  onReset={props.onReset}
                />
              </Box>
              <TransformComponent>
                <TreeContainer 
                  rootId={rootId}
                  treeRef={treeRef}
                  nodeWidth={nodeWidth}
                  nodeHeight={nodeHeight}
                  calculatedData={data}
                  renderNode={props.renderNode}
                  zoomToRoot={zoomToElement}
                  backgroundPath={treeBackgroundPath}
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
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  calculatedData: any;
  treeRef: any;
  backgroundPath: string;
  renderNode: (node: any) => React.ReactNode;
  zoomToRoot?: (root: HTMLElement, scale?: number) => void;
}
function TreeContainer(props: TreeContainerProps) {
  const { 
    calculatedData, treeRef, nodeHeight, nodeWidth, backgroundPath, rootId,
    renderNode, zoomToRoot,
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

  const treeWidth = calculatedData.canvas.width * nodeWidth;
  const treeHeight = calculatedData.canvas.height * nodeHeight;

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
      className={`border-primary ${props.className ? props.className : ""}`}
      style={{
        width: treeWidth,
        height: treeHeight,
        borderRadius: "2rem",
        ...handleBackground(),
      }}
    >
      {calculatedData.connectors.map((connector, idx) => (
        <Connector
          key={idx}
          connector={connector}
          width={nodeWidth}
          height={nodeHeight}
        />
      ))}
      {calculatedData.nodes.map(renderNode)}
    </div>
  )
}