import React from "react";
import { t } from "i18next";

import { Node } from 'components/tree-relatives/types';
import { Selection } from "components";

interface TreeSearchBarProps {
  nodes: Node[];
  displayField?: string;
  onSelect: (node: HTMLElement, scale?: number) => void;
  style?: React.CSSProperties; 
}

export function TreeSearchBar(props: TreeSearchBarProps) {
  const { nodes, onSelect, style } = props;

  const onSelectNode = (node: any) => {
    /* node should be {
      value: number, label: string
    } */
    const div = document.querySelector<HTMLDivElement>(`#node-${node.value}`);
    if (div) {
      onSelect(div);
    }
  };

  const options = nodes.map((node: any) => {
    return {
      value: node.id,
      label: node.name
    }
  })

  return (
    <Selection
      label={""} field={""} isSearchable 
      options={options} observer={null as any}
      onChange={(value, action: any) => onSelectNode(value)}
      placeHolder={t("Tìm kiếm thành viên...")}
      className="mx-2"
      style={{ 
        width: "75vw",
        ...style
      }}
    />
  )
}