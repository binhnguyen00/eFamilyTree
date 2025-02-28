import React from "react";
import { t } from "i18next";

import { Node } from 'components/tree-relatives/types';
import { Selection, SelectionOption } from "components";

interface TreeSearchBarProps {
  nodes: Node[];
  displayField?: string;
  onSelect: (node: HTMLElement, scale?: number) => void;
  style?: React.CSSProperties; 
}

export function TreeSearchBar(props: TreeSearchBarProps) {
  const { nodes, onSelect, style } = props;

  const onSelectOption = (option: SelectionOption) => {
    const div = document.querySelector<HTMLDivElement>(`#node-${option.value}`);
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
      onChange={(option: SelectionOption, action: any) => onSelectOption(option)}
      placeHolder={t("Tìm kiếm thành viên...")}
      className="mx-2"
      style={{ 
        width: "75vw",
        ...style
      }}
    />
  )
}