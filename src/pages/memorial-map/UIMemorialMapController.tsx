import React from "react";

import { useAppContext, useZaloSettings } from "hooks";
import { Coordinate } from "components";

import { CreateButton } from "./CreateButton";

interface UIMemorialMapControllerProps {
  onAdd?: (coor: Coordinate) => void;
}
export function UIMemorialMapController(props: UIMemorialMapControllerProps) {
  const { onAdd } = props;

  return (
    <div className="scroll-h">
      <CreateButton 
        onAdd={onAdd} 
      />
    </div>
  )
}