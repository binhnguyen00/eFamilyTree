import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { CommonIcon, WorldMapConfig } from "components";

interface MapTypeButtonsProps {
  onSelect?: (value: string) => void;
}

export function MapTerrainButtons(props: MapTypeButtonsProps) {
  const { onSelect } = props;

  const onChangeMapTerrain = (value: string) => {
    if (onSelect) onSelect(value);
  }

  return (
    <>
      <Button 
        size="small" 
        style={{ minWidth: 120 }}
        onClick={() => onChangeMapTerrain(WorldMapConfig.defaultTileLayer)} 
        prefixIcon={<CommonIcon.Map/>}
      >
        {t("Mặc Định")}
      </Button>
      <Button 
        size="small" 
        style={{ minWidth: 120 }}
        onClick={() => onChangeMapTerrain(WorldMapConfig.satelliteTileLayer)} 
        prefixIcon={<CommonIcon.Map/>}
      >
        {t("Vệ Tinh")}
      </Button>
    </>
  )
}