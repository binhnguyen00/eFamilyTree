import React from "react";

import { Marker } from "components";

import { CreateButton } from "./CreateButton";

interface UIMemorialMapControllerProps {
  onAdd?: (marker: Marker) => void;
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