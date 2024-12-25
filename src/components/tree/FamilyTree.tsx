import React from 'react';
import ReactHtml2Canvas from 'react-html2canvas'
import { openWebview } from "zmp-sdk/apis";
import { renderToStaticMarkup } from 'react-dom/server';
import { useGesture } from "@use-gesture/react";
import { t } from 'i18next';
import { Box } from 'zmp-ui';

import Connector from './Connector';
import calcTree from 'components/tree-relatives';
import { Gender, Node } from 'components/tree-relatives/types';
import { SizedBox, CommonIcon } from 'components';
import { FailResponse } from 'server';
import { FamilyTreeApi, TestApi } from 'api';
import { useAppContext } from 'hooks';

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
  let ref = React.useRef<any>();

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

  const center = {
    x: ((treeWidth / 2) - (window.innerWidth / 2)) * -1,
    y: ((treeHeight / 2) - window.innerHeight / 4) * -1,
  };

  let [ crop, setCrop ] = React.useState({ x: center.x, y: center.y, scale: 0.5 });
  let [ shouldAnimate, setShouldAnimate ] = React.useState(false);
  let { settings } = useAppContext();

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setShouldAnimate(false);
        setCrop((prev) => ({ ...prev, x: dx, y: dy }));
      },
      onPinch: ({ offset: [scale] }) => {
        setShouldAnimate(false);
        setCrop((prev) => ({ ...prev, scale: Math.max(0.2, Math.min(2.2, scale)) })); // Clamp scale
      },
    },
    {
      eventOptions: {
        passive: true, 
        capture: true, 
        pointer: true,
        once: true
      },
      wheel: {
        enabled: true,
      },
      target: treeRef,
      enabled: true,
      drag: {
        from: () => [crop.x, crop.y],
      },
      pinch: {
        from: () => [crop.scale, 0],
      },
    }
  );

  const tree = () => {
    let background;
    if (settings.background && settings.background.id) {
      background = {
        backgroundImage: `url(http://giapha.mobifone5.vn${settings.background.path})`,
        // backgroundImage: `url(http://localhost:8069${settings.background.path})`,
      }
    } else background = {
      backgroundColor: `var(--tree-background-color)`,
    }
    return (
      <ReactHtml2Canvas ref={ref} id="tree-canvas">
        <div
          className={`${props.className ? props.className : ""}`}
          style={{
            zIndex: 1,
            position: 'relative',
            width: treeWidth,
            height: treeHeight,

            left: crop.x,
            top: crop.y,
            transform: `scale(${crop.scale})`,
            transition: shouldAnimate ? 'left 0.3s ease, top 0.3s ease, transform 0.3s ease' : 'none', 
            touchAction: "none",
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
      </ReactHtml2Canvas>
    )
  }

  return (
    <div ref={treeRef} style={{ touchAction: "none" }}>

      <Box flex flexDirection='row' justifyContent='space-between' className='ml-1 mr-1'>
        <FamilyTreeSearch 
          searchFields={searchFields}
          displayField={props.searchDisplayField}
          nodes={props.nodes}
          onSelect={(xPos, yPos, scale) => {
            setShouldAnimate(true);
            setCrop({ x: xPos, y: yPos, scale })
          }}
        />

        <FamilyTreeController 
          centerPos={{ x: center.x, y: center.y }}
          onCenter={(xPos, yPos, scale) => {
            setShouldAnimate(true);
            setCrop({ x: xPos, y: yPos, scale: scale });
          }}
          onZoomIn={(xPos, yPos, scale) => {
            if (crop.scale >= 2.2) return; // Scale Limit
            setShouldAnimate(true);
            setCrop((crop) => ({ ...crop, scale: crop.scale + scale }));
          }}
          onZoomOut={(xPos, yPos, scale) => {
            if (crop.scale <= 0.2) return; // Zoom Limit
            setShouldAnimate(true);
            setCrop((crop) => ({ ...crop, scale: crop.scale - scale }));
          }}
          onReset={props.onReset}
          onExportAsImage={() => {
            ref.current.handleDownload();
          }}
          html2pdf={tree()}
        />
      </Box>

      {tree()}

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
          <p> {`x: ${crop.x}`} </p>
          <p> {`y: ${crop.y}`} </p>
        </div>
      )}

    </div>
  );
});

// ============================================
// Tree Controller
// ============================================
interface FamilyTreeControllerProps {
  centerPos: { x: number, y: number };
  onCenter: (xPos: number, yPos: number, scale: number) => void;
  onZoomIn: (xPos: number, yPos: number, scale: number) => void;
  onZoomOut: (xPos: number, yPos: number, scale: number) => void;
  onReset?: () => void;
  onExportAsImage?: () => void;
  html2pdf?: React.ReactNode;
}

function FamilyTreeController(props: FamilyTreeControllerProps) {
  let { onCenter, onZoomIn, onZoomOut, onReset, onExportAsImage, centerPos, html2pdf } = props;

  /** @deprecated */
  const exportPDF = () => {
    const html: string = renderToStaticMarkup(html2pdf);
    const success = (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tree.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    const fail = (error: FailResponse) => {
      console.error(error);
    }
    TestApi.exportPDF(html, success, fail);
  };

  const exportPNG = () => {
    onExportAsImage?.();
  }

  const style = {
    color: "var(--primary-color)",
    zIndex: 2,
  } as React.CSSProperties;

  return (
    <Box 
      flex flexDirection='column' alignItems='flex-end'
      style={style}
    >
      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={() => onCenter(centerPos.x, centerPos.y, 0.5)}
        children={<CommonIcon.Home size={32}/>}
      />

      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={() => onZoomIn(0, 0, 0.1)}
        children={<CommonIcon.ZoomIn size={32}/>}
      />

      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={() => onZoomOut(0, 0, 0.1)}
        children={<CommonIcon.ZoomOut size={32}/>}
      />

      {/* TODO: Future Feature
      <SizedBox
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={exportPDF}
        children={<CommonIcon.PDF size={32}/>}
      /> */}

      <SizedBox
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={exportPNG}
        children={<CommonIcon.PNG size={32}/>}
      />

      {onReset && (
        <SizedBox 
          className='bg-secondary p-1 button'
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

  const style = {
    color: "var(--primary-color)",
    fontSize: "1.2rem",
    width: "80vw",
    zIndex: 2,
  } as React.CSSProperties;

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