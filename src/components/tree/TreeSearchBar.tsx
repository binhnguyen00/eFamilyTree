import React from "react";
import { t } from "i18next";

import { Node } from 'components/tree-relatives/types';

import { Popover, CommonIcon } from "components";

interface TreeSearchBarProps {
  nodes: Node[];
  searchFields?: string[];
  displayField?: string;
  onSelect: (node: HTMLElement, scale?: number) => void;
}

export function TreeSearchBar(props: TreeSearchBarProps) {
  const { nodes, searchFields, onSelect, displayField = "id" } = props;

  const [filteredNodes, setFilteredNodes] = React.useState<any[]>([]);

  const onSelectNode = (node: any) => {
    const div = document.querySelector<HTMLDivElement>(`#node-${node.id}`);
    if (div) {
      onSelect(div);
    }
  };

  return (
    <div
      style={{
        fontSize: "1.2rem",
        width: "80vw",
        zIndex: 9999,
        position: "fixed",
        left: 5,
      }}
    >
      <SearchInput
        nodes={nodes}
        searchFields={searchFields}
        setFilteredNodes={setFilteredNodes}
      />
      <FilteredNodes
        nodes={filteredNodes}
        displayField={displayField}
        onSelectNode={onSelectNode}
        setFilteredNodes={setFilteredNodes}
      />
    </div>
  );
}

interface FilteredNodesProps {
  nodes: any[];
  displayField: string;
  onSelectNode: (node: any) => void;
  setFilteredNodes: React.Dispatch<React.SetStateAction<any[]>>;
}

function FilteredNodes(props: FilteredNodesProps) {
  const { nodes, displayField, onSelectNode, setFilteredNodes } = props;

  if (!nodes.length) return null;

  return (
    <div
      className="flex-v bg-white p-2 rounded border"
      style={{
        position: "fixed",
        height: "fit-content",
        overflow: "auto",
        maxHeight: "300px",
        fontSize: "1.2rem",
        width: "80vw",
        zIndex: 9999,
        left: 5,
      }}
    >
      {nodes.map((node) => (
        <div
          key={node.id}
          onClick={() => {
            onSelectNode(node);
            setFilteredNodes([]);
          }}
          className="mb-1 p-1"
          style={{ borderBottom: "1px solid var(--primary-color)" }}
        >
          <span>{node[displayField] || node.id}</span>
        </div>
      ))}
    </div>
  );
}

interface SearchInputProps {
  nodes: any[];
  searchFields?: string[];
  setFilteredNodes: React.Dispatch<React.SetStateAction<any[]>>;
}

function SearchInput(props: SearchInputProps) {
  const { nodes, searchFields, setFilteredNodes } = props;

  return (
    <div className="flex-h border-primary bg-white rounded p-1">
      <input
        type="text"
        placeholder={`${t("search")} ${t("family_member")}...`}
        style={{
          border: "none",
          width: "80vw",
          outline: "none",
          paddingLeft: 10
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          const filtered = nodes.filter((node) =>
            searchFields?.some((field) =>
              node[field]?.toString().toLowerCase().includes(value.toLowerCase())
            )
          );

          if (value.length) {
            setFilteredNodes(filtered);
          } else {
            setFilteredNodes([]); // Reset if user clears input
          }
        }}
      />
      <Popover 
        open={false} 
        childPosition={"bottom"}
        content={<CommonIcon.VerticalDots size={26} style={{ color: `var(--primary-color)` }}/>}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, neque commodi deserunt in voluptatibus delectus sunt suscipit cupiditate ullam, harum ipsa eius doloribus animi dolores at repudiandae fuga accusantium reiciendis earum architecto adipisci beatae. Suscipit mollitia nobis fugit accusantium veritatis architecto nostrum eum ipsum, ab repellendus explicabo expedita est, maxime eius debitis repudiandae. Magnam debitis aliquam vero ratione, veniam vitae consequatur totam, dolor asperiores incidunt repudiandae molestias magni illo culpa eius, perspiciatis quibusdam est. Minus doloremque suscipit aliquid totam ad veniam, ratione aspernatur exercitationem quaerat sit labore ipsam distinctio tempore beatae cum numquam vero architecto eaque perferendis praesentium. Ipsam, debitis!
      </Popover>
    </div>
  );
}