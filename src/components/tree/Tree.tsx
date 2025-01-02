import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Box } from 'zmp-ui';

import Connector from './TreeConnector';
import calcTree from 'components/tree-relatives';
import { Gender, Node } from 'components/tree-relatives/types';
import { useAppContext } from 'hooks';
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
  let { settings } = useAppContext();
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

  let treeRef = React.useRef<HTMLDivElement | null>(null);
  const tree = () => {
    let background: any;
    if (settings.background && settings.background.id) {
      background = {
        backgroundImage: `url(http://giapha.mobifone5.vn${settings.background.path})`,
      }
    } else background = {
      backgroundColor: `var(--tree-background-color)`,
    }

    return (
      <div
        id="tree-canvas"
        ref={treeRef}
        className={`${props.className ? props.className : ""}`}
        style={{
          width: treeWidth,
          height: treeHeight,
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

  const calTreeWraperWidthAndHeight = (): React.CSSProperties => {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || "0");
    const safeAreaInsetTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zaui-safe-area-inset-top') || "0");
    const totalHeaderHeight = safeAreaInsetTop + headerHeight;
    return {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight - totalHeaderHeight}px`,
      paddingTop: `${totalHeaderHeight + 5}px`,
    } as React.CSSProperties;
  }

  return (
    <div>
      <TransformWrapper 
        minScale={0.2}
        centerOnInit
        centerZoomedOut
        initialScale={0.5}
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