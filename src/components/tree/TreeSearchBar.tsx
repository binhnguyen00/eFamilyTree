import React from "react";
import { t } from "i18next";
import { Button, Text, Avatar as ZaloAvatar } from "zmp-ui";

import { useAppContext } from "hooks";
import { TreeDataProcessor } from "utils";
import { CommonIcon, Popover, ScrollableDiv, Selection, SelectionOption } from "components";

import { Node } from 'components/tree-relatives/types';

interface TreeSearchBarProps {
  nodes: Node[];
  displayField?: string;
  onSelect: (node: HTMLElement, scale?: number) => void;
  style?: React.CSSProperties; 
}

export function TreeSearchBar(props: TreeSearchBarProps) {
  const { nodes, onSelect, style } = props;

  const processor = React.useMemo(() => {
    const holder = new TreeDataProcessor([]); holder.setNodes(nodes);
    return holder;
  }, [ nodes ]);
  

  const onSelectOption = (option: SelectionOption) => {
    const div = document.querySelector<HTMLDivElement>(`#node-${option.value}`);
    if (div) {
      onSelect(div);
    }
  };

  const onSelectNode = (id: number) => {
    const div = document.querySelector<HTMLDivElement>(`#node-${id}`);
    if (div) {
      onSelect(div);
    }
  }

  const options = nodes.map((node: any) => {
    return {
      value: node.id,
      label: node.name
    }
  })

  return (
    <div className="flex-h px-2" style={{ ...style }}>
      <Selection
        label={""} field={""} isSearchable 
        options={options} observer={null as any}
        onChange={(option: SelectionOption, action: any) => onSelectOption(option)}
        placeHolder={t("Tìm kiếm thành viên...")}
        style={{ 
          width: "75vw",
        }}
      />
      <Popover 
        open={false} 
        childPosition={"bottom"}
        content={
          <CommonIcon.VerticalDots size={35} style={{ 
            color: `var(--primary-color)`, 
          }}/>
        }
      >
        <SearchByGeneration processor={processor} onSelect={onSelectNode}/>
      </Popover>
    </div>
  )
}

interface SearchFilterProps {
  onSelect: (id: number) => void;
  processor: TreeDataProcessor;
}
function SearchByGeneration(props: SearchFilterProps) {
  const { processor, onSelect: onSelectNode} = props;
  const maxGeneration: number = processor.getMaxGeneration();

  const { serverBaseUrl } = useAppContext();
  const [ generation, setGeneration ] = React.useState<number>(1);

  const renderGenerations = () => {
    const generations: React.ReactNode[] = React.useMemo(() => {
      return Array.from({ length: maxGeneration }, (_, index) => {
        const generation = index + 1;
        return (
          <Button size="small" key={index + 1} onClick={() => setGeneration(generation)}>
            {`Đời ${generation}`}
          </Button>
        )
      })
    }, [ processor.nodes, maxGeneration ]); 

    return (
      <ScrollableDiv className="flex-v border-right px-2" direction="vertical" height={300} width={120}>
        {generations}
      </ScrollableDiv>
    )
  }

  const renderMembersInGeneration = () => {
    const nodes: Node[] = processor.getNodesByGeneration(generation);
    const members: React.ReactNode[] = React.useMemo(() => {
      return nodes.map((node: Node) => {
        const avatar = node.avatar ? `${serverBaseUrl}/${node.avatar}` : "";
        const avatarHolder = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(node.name)}`;

        return (
          <>
            <div
              key={node.id}
              className="flex-h justify-start flex-grow-0 p-2"
              style={{ textAlign: "center", alignContent: "center", alignItems: "center" }}
              onClick={() => onSelectNode(parseInt(node.id))}
            >
              <div style={{ width: 35 }}>
                <ZaloAvatar backgroundColor="BLUE-BLUELIGHT" size={35} src={avatar === "" ? avatarHolder : avatar}/>
              </div>
              <Text> {node.name} </Text>
            </div>
            
            <hr/>
          </>
        )
      })
    }, [ generation ]);

    return (
      <ScrollableDiv direction="vertical" height={300} width={"100%"}>
        <Text.Title className="text-primary"> {`${"Đời"} ${generation}`} </Text.Title>
        <div className="flex-v">
          {members}
        </div>
      </ScrollableDiv>
    );
  }

  if (!maxGeneration) return <p> {t("data_not_available")} </p>
  return (
    <div style={{ height: "100%", width: "92vw" }} className="flex-h">
      {renderGenerations()}
      {renderMembersInGeneration()}
    </div>
  );
}