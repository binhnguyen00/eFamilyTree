import React from 'react';

import calcTree from 'components/tree-relatives';
import Connector from './Connector';
import { Gender, Node } from 'components/tree-relatives/types';

import { TreeNode, TreeConfig } from 'components';
import { useGesture } from "@use-gesture/react";

interface TreeProps {
  nodes: Node[];
  rootId: string;
  nodeWidth: number;
  nodeHeight: number;
  placeholders?: boolean;
  className?: string;
  searchFields?: string[];
  renderNode: (node: any) => React.ReactNode;
}

export default React.memo<TreeProps>(function FamilyTree(props) {
  if (props.nodes.length === 0) return (
    <TreeNode 
      node={{
        name: "text", id: "", gender: Gender.male, avatar: "",
        parents: [], siblings: [], spouses: [], children: []
      }} 
      displayField="" 
      isRoot={true} 
      onSelectNode={() => {}} 
      style={{
        width: (TreeConfig.nodeWidth),
        height: (TreeConfig.nodeHeight),
      }}
    />
  );

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
  let [ crop, setCrop ] = React.useState({ x: 0, y: 0, scale: 1 });

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setCrop((crop) => ({ ...crop, x: dx, y: dy }));
      },
      onPinch: ({ offset: [d] }) => {
        setCrop((crop) => ({ ...crop, scale: d }));
      },
    }, 
    {
      target: treeRef,
      eventOptions: {
        passive: false,
      },
    }
  ) 

  return (
    <>

      <div>
        <p> X: {crop.x} </p>
        <p> Y: {crop.y} </p>
      </div>

      <button className='border' onClick={() => {
        const center = -((treeWidth - props.nodeWidth * 4) / 2);
        setCrop({ x: center, y: 0, scale: 1 });
      }}>
        center
      </button>

      <button className='border' onClick={() => {
        setCrop((crop) => ({ ...crop, scale: crop.scale + 0.1 }));
      }}>
        + In
      </button>

      <button className='border' onClick={() => {
        setCrop((crop) => ({ ...crop, scale: crop.scale - 0.1 }));
      }}>
        - Out
      </button>

      <FamilyTreeSearch 
        searchFields={ ["id", "name"] }
        nodes={props.nodes}
        onSelect={(xPos, yPos, scale) => {
          console.log(xPos, yPos);
          setCrop({ x: xPos, y: yPos, scale });
        }}
      />

      <div
        ref={treeRef}
        className={`${props.className} border`}
        style={{
          zIndex: -1,
          position: 'relative',
          width: treeWidth,
          height: treeHeight,

          left: crop.x,
          top: crop.y,
          transform: `scale(${crop.scale})`,
          touchAction: "none",
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

    </>
  );
});

interface FamilyTreeSearchProps {
  nodes: Node[];
  searchFields?: string[];
  onSelect: (xPos: number, yPos: number, scale: number) => void;
}
function FamilyTreeSearch(props: FamilyTreeSearchProps) {
  let { nodes, searchFields, onSelect } = props;

  let [ filteredNodes, setFilteredNodes ] = React.useState<any[]>([]);

  const onSelectNode = (node: any) => {
    console.log(node);
    
    const div = document.querySelector<HTMLDivElement>(`#node-${node.id}`);

    if (div) { // Get the div postion (x, y)
      const nodeStyle = getComputedStyle(div);
      const transform = nodeStyle.transform;
      if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix\((.+)\)/) || transform.match(/matrix3d\((.+)\)/);
        if (matrix && matrix[1]) {
          const values = matrix[1].split(',').map(parseFloat);
          const x = values[4];
          const y = values[5];
          onSelect(-(x - 100), -(y - 100), 1); // Zoom in the Node position
        }
      }
    }
  }

  const renderFilterdNodes = () => {
    if (filteredNodes.length) {
      let html = [] as React.ReactNode[];
      filteredNodes.forEach(node => {
        html.push(
          <div key={node.id} onClick={() => onSelectNode(node)}>
            <span> {node.id} </span> <span> {node.name} </span>
          </div>
        )
      })
      return (
        <div className='flex-v' style={{ position: "fixed" }}>
          {html}
        </div>  
      )
    } 

    return;
  }

  return (
    <div>
      <label> Search </label>
      <input
        type='text'
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
      {renderFilterdNodes()}
    </div>
  )
}