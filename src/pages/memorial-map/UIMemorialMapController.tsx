import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { CommonIcon, Coordinate } from "components";

interface UIMemorialMapControllerProps {
  onAdd?: (coor: Coordinate) => void;
}
export function UIMemorialMapController(props: UIMemorialMapControllerProps) {
  const { onAdd } = props;

  return (
    <div className="scroll-h">
      <ButtonCreate onAdd={onAdd}/>
    </div>
  )
}

function ButtonCreate({ onAdd }: { onAdd?: (coor: Coordinate) => void }) {

  return (
    <>
      <Button
        variant="secondary" size="small" 
        onClick={() => {
          onAdd?.({ lat: 20.818265595799424, lng: 106.69749335944385 })
        }}
        prefixIcon={<CommonIcon.Plus/>}
      >
        {t("add")}
      </Button>
    </>
  )
}
