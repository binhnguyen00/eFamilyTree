import React from "react";

import { Coordinate } from "components";

import { CreateButton } from "./CreateButton";

interface UIMemorialMapControllerProps {
  onAdd?: (coor: Coordinate) => void;
}
export function UIMemorialMapController(props: UIMemorialMapControllerProps) {
  const { onAdd } = props;

  return (
    <div className="scroll-h px-1">
      <CreateButton 
        onAdd={onAdd} 
      />
    </div>
  )
}