import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Box } from 'zmp-ui';

import Connector from './TreeConnector';
import calcTree from 'components/tree-relatives';
import { Gender, Node } from 'components/tree-relatives/types';
import { useAppContext } from 'hooks';
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

  let { settings, serverBaseUrl } = useAppContext();
  let treeRef = React.useRef<HTMLDivElement | null>(null);
  const tree = () => {
    let background = {} as React.CSSProperties;
    if (settings.background && settings.background.id) {
      // backgroundImage: `url(http://localhost:8069/${settings.background.path})`,
      background = {
        backgroundImage: `url(${serverBaseUrl}/${settings.background.path})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      };
    } else background = {
      backgroundColor: `var(--tree-background-color)`,
    }

    return (
      <div
        id="tree-canvas"
        ref={treeRef}
        className={`border-primary ${props.className ? props.className : ""}`}
        style={{
          width: treeWidth,
          height: treeHeight,
          borderRadius: "2rem",
          ...background,
        }}
      >
        {data.connectors.map((connector, idx) => (
          <Connector
            key={idx}
            connector={connector}
            width={nodeWidth}
            height={nodeHeight}
          />
        ))}
        {data.nodes.map(props.renderNode)}
      </div>
    )
  }

  return (
    <div 
      style={{ // Tree needs to know it's w & h or the pinch-zoom-pan would be buggy.
        width: TreeConfig.treeWidth,
        height: TreeConfig.treeHeight,
      }}
    >
      <TransformWrapper 
        initialScale={0.5}
        minScale={0.1}
        centerOnInit
        centerZoomedOut
      >
        {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
          <React.Fragment>
            <Box flex flexDirection='row' justifyContent='space-between'>
              <TreeSearchBar 
                searchFields={searchFields}
                displayField={props.searchDisplayField}
                nodes={props.nodes}
                onSelect={zoomToElement}
              />
              <TreeController
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onCenter={resetTransform}
                html2export={{
                  content: tree(),
                  width: treeWidth,
                  height: treeHeight,
                }}
              />
            </Box>
            <TransformComponent>
              {tree()}
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
});