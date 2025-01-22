import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { Header, WorldMap, Coordinate } from "components";

export function UIMemorialMap() {
  const [ newMarker, setNewMarker ] = React.useState<Coordinate>();

  const onAddMarker = (coor: Coordinate) => {
    setNewMarker(coor)
  }

  return (
    <div className="container-padding">
      <Header title={t("memorial_location")}/>
      
      <div className="flex-v">
        <Text.Title> {t("memorial_map")} </Text.Title>
        <WorldMap
          addMarker={newMarker}
        />
        <UIMemorialMapController onAdd={onAddMarker}/>
      </div>

    </div>
  )
}

interface UIMemorialMapControllerProps {
  onAdd?: (coor: Coordinate) => void;
}
function UIMemorialMapController(props: UIMemorialMapControllerProps) {
  const { onAdd } = props;

  return (
    <div className="scroll-h">
      <Button 
        variant="secondary" size="small" 
        onClick={() => {
          onAdd?.({ lat: 20.818265595799424, lng: 106.69749335944385 })
        }}
      >
        {t("create")}
      </Button>
    </div>
  )
}

