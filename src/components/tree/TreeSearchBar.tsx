import React from "react";
import { t } from "i18next";

import { Node } from 'components/tree-relatives/types';
import { TreeDataProcessor } from "utils";
import { Popover, CommonIcon, ScrollableDiv } from "components";
import { Button, Text } from "zmp-ui";

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
        onSelectNode={onSelectNode}
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
  onSelectNode: (node: any) => void;
  setFilteredNodes: React.Dispatch<React.SetStateAction<any[]>>;
}

function SearchInput(props: SearchInputProps) {
  const { nodes, searchFields, setFilteredNodes, onSelectNode } = props;
  const processor = new TreeDataProcessor([]);
  processor.setNodes(nodes);

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
        <SearchFilter processor={processor} onSelectNode={onSelectNode}/>
      </Popover>
    </div>
  );
}

interface SearchFilterProps {
  onSelectNode: (node: any) => void;
  processor: TreeDataProcessor;
}
function SearchFilter(props: SearchFilterProps) {
  const { processor, onSelectNode} = props;

  const maxGeneration: number = processor.getMaxGeneration();

  const Generation = React.memo(({ onSelectGeneration }: { onSelectGeneration: (generation: number) => void }) => {
    const renderGenerationNumbers = () => {
      const html: JSX.Element[] = [];
      for (let i = 1; i <= maxGeneration; i++) {
        html.push(
          <Button className="mb-1" size="small" key={i} onClick={() => onSelectGeneration(i)}>
            {`Đời ${i}`}
          </Button>
        );
      }
      return html;
    };

    return (
      <ScrollableDiv className="border-right pr-1" direction="vertical" height={300} width={100}>
        {renderGenerationNumbers()}
      </ScrollableDiv>
    );
  });

  const MembersInGeneration = React.memo(({ generation }: { generation: number }) => {
    const nodes: Node[] = processor.getNodesByGeneration(generation);
    return (
      <ScrollableDiv direction="vertical" height={300} width={"100%"} className="rounded">
        <Text.Title className="text-primary"> {`Đời ${generation}`} </Text.Title>
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => {
              onSelectNode(node);
            }}
            className="mb-1 p-1"
            style={{ borderBottom: "1px solid var(--primary-color)" }}
          >
            <span>{node["name"] || node.id}</span>
          </div>
        ))}
      </ScrollableDiv>
    );
  });

  const [ generation, setGeneration ] = React.useState<number>(1);

  if (!maxGeneration) return <p> {t("data_not_available")} </p>
  return (
    <div style={{ height: "100%", width: "92vw" }} className="flex-h">
      <Generation onSelectGeneration={setGeneration}/>
      <MembersInGeneration generation={generation}/>
    </div>
  );
}