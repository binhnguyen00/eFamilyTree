import React from 'react';
import { t } from 'i18next';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Connector from '../tree/Connector';
import calcTree from 'components/tree-relatives';
import { Gender, Node } from 'components/tree-relatives/types';
import { SizedBox, CommonIcon } from 'components';
import { useAppContext } from 'hooks';
import { ZmpSDK } from 'utils';
import { FamilyTreeApi } from 'api';
import { ServerResponse } from 'server';
import { Box } from 'zmp-ui';

import "./transform-wrapper.scss";

// ============================================
// Tree
// ============================================
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
  statsForNerds?: boolean;
  onReset?: () => void;
}

export default React.memo<TreeProps>(function FamilyTree(props) {
  if (!props.nodes.length || !props.rootId) {
    props.nodes = [{
      id: "0",
      gender: Gender.male,
      name: "Thành Viên",
      parents: [],
      children: [],
      siblings: [],
      spouses: []
    }]
    props.rootId = "0";
  }

  let { searchFields = [ "id" ] } = props;
  let treeRef = React.useRef<HTMLDivElement | null>(null);

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

  let { settings } = useAppContext();

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
          zIndex: 1,
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
      width: "100%",
      height: `${window.innerHeight - totalHeaderHeight}px`,
      paddingTop: `${totalHeaderHeight}px`
    } as React.CSSProperties;
  }

  return (
      <div>

        <Box  className='ml-1 mr-1' flex flexDirection='row' justifyContent='space-between' >
          <FamilyTreeSearch 
            searchFields={searchFields}
            displayField={props.searchDisplayField}
            nodes={props.nodes}
            onSelect={(xPos, yPos, scale) => {
              // TODO
            }}
          />
          <FamilyTreeController/>
        </Box>

        <div
          style={{...calTreeWraperWidthAndHeight()}}
        >
          <TransformWrapper
            minScale={0.1}
            maxScale={1}
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            centerOnInit
            smooth
          >
            <TransformComponent>
              {tree()}
            </TransformComponent>
          </TransformWrapper>
        </div>

        {props.statsForNerds && (
          <div 
            className='flex-h' 
            style={{ 
              color: "black", 
              position: "absolute", 
              top: "90%", 
              left: "50%", 
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}>
              {/* stats */}
          </div>
        )}

      </div>
  );
});

// ============================================
// Tree Controller
// ============================================
interface FamilyTreeControllerProps {
  centerPos?: { x: number, y: number };
  onCenter?: (xPos: number, yPos: number, scale: number) => void;
  onZoomIn?: (xPos: number, yPos: number, scale: number) => void;
  onZoomOut?: (xPos: number, yPos: number, scale: number) => void;
  onReset?: () => void;
  html2export?: {
    content: React.ReactNode;
    width: number;
    height: number;
  };
}

function FamilyTreeController(props: FamilyTreeControllerProps) {
  const { phoneNumber } = useAppContext();
  const { onCenter, onZoomIn, onZoomOut, onReset, centerPos, html2export } = props;

  const exportPNG = async () => {
  }

  const exportSVG = () => {
  }

  const style = {
    color: "var(--primary-color)",
    zIndex: 9999,
    position: "fixed",
    right: 5,
    paddingTop: "calc(var(--header-height) + 10px)",
  } as React.CSSProperties;

  return (
    <Box
      flex flexDirection='column' alignItems='flex-end'
      style={style}
    >
      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        // onClick={() => onCenter(centerPos.x, centerPos.y, 0.5)}
        children={<CommonIcon.Home size={32}/>}
      />

      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        // onClick={() => onZoomIn(0, 0, 0.1)}
        children={<CommonIcon.ZoomIn size={32}/>}
      />

      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        // onClick={() => onZoomOut(0, 0, 0.1)}
        children={<CommonIcon.ZoomOut size={32}/>}
      />

      <SizedBox
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={exportPNG}
        children={<CommonIcon.PNG size={32}/>}
      />

      <SizedBox
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={exportSVG}
        children={<CommonIcon.SVG size={32}/>}
      />

      {onReset && (
        <SizedBox 
          className='bg-secondary p-1 button border-primary'
          width={"fit-content"} height={"fit-content"} border
          onClick={() => onReset()}
          children={<CommonIcon.Reset size={32}/>}
        />
      )}
    </Box>
  )
}

// ============================================
// Tree Search
// ============================================
interface FamilyTreeSearchProps {
  nodes: Node[];
  searchFields?: string[];
  displayField?: string;
  onSelect: (xPos: number, yPos: number, scale: number) => void;
}

function FamilyTreeSearch(props: FamilyTreeSearchProps) {
  let { nodes, searchFields, onSelect, displayField = "id" } = props;

  let [ filteredNodes, setFilteredNodes ] = React.useState<any[]>([]);

  const onSelectNode = (node: any) => {
    const div = document.querySelector<HTMLDivElement>(`#node-${node.id}`);

    if (div) { 
      const { x, y } = getDivPosition(div);
      onSelect(-(x - 100), -(y - 100), 0.8); // Zoom in the Node position
    }
  }

  const style = {
    color: "var(--primary-color)",
    fontSize: "1.2rem",
    width: "80vw",
    zIndex: 9999,
    position: "fixed",
    left: 5,
    marginTop: "calc(var(--header-height) + 10px)",
  } as React.CSSProperties;

  const renderFilterdNodes = () => {
    let html = [] as React.ReactNode[];
    if (filteredNodes.length) {
      filteredNodes.forEach(node => {
        html.push(
          <div 
            key={node.id} 
            onClick={() => {
              onSelectNode(node);
              setFilteredNodes([]);
            }} 
            className='mb-1 p-1'
            style={{ borderBottom: "1px solid var(--primary-color)" }}
          >
            <span> {node[displayField] || node.id} </span>
          </div>
        )
      })
    } 
    if (!html.length) return null;;
    return(
      <div 
        className='flex-v bg-secondary p-2 rounded' 
        style={{ 
          position: "fixed", 
          height: "fit-content", 
          overflow: "auto", 
          maxHeight: "300px", 
          ...style 
        }}
      >
        {html}
      </div>
    );
  }

  return (
    <div style={style}>

      <div className='flex-h border-primary bg-secondary rounded p-1'>
        <input
          type='text'
          placeholder={t("search")}
          style={{
            border: "none",
            width: "80vw",
            outline: "none",
            background: "transparent",
          }}
          onChange={(e: any) => {
            const value = e.target.value as string;
            const filtered = nodes.filter(node =>
              searchFields?.some(field => 
                node[field]?.toString().toLowerCase().includes(value.toLowerCase())
              )
            ) as any[];

            if (value.length !== 0) {
              setFilteredNodes(filtered);
            } else setFilteredNodes([]); // Reset if user clears input
          }}
        />
        <CommonIcon.SearchPerson size={30} />
      </div>

      {renderFilterdNodes()}

    </div>
  )
}

function getDivPosition(div: HTMLDivElement | null) {
  if (!div) return { x: 0, y: 0 };
  const style = getComputedStyle(div);
  const transform = style.transform;
  if (transform && transform !== 'none') {
    const matrix = transform.match(/matrix\((.+)\)/) || transform.match(/matrix3d\((.+)\)/);
    if (matrix && matrix[1]) {
      const values = matrix[1].split(',').map(parseFloat);
      const x = values[4];
      const y = values[5];
      return { x, y };
    }
  }
  return { x: 0, y: 0 };
}