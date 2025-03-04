import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { CommonIcon, MapTile, WorldMapConfig } from "components";

interface MapTypeButtonsProps {
  onSelect?: (terrain: MapTile) => void;
}

export function MapTerrainButtons(props: MapTypeButtonsProps) {
  const { onSelect } = props;

  const onChangeMapTerrain = (terrain: MapTile) => {
    if (onSelect) onSelect(terrain);
  }

  return (
    <>
      <Button 
        size="small" 
        style={{ minWidth: 120 }}
        onClick={() => onChangeMapTerrain({
          url: WorldMapConfig.defaultTileLayer,
          maxZoom: WorldMapConfig.defaultMaxZoom
        })} 
        prefixIcon={<CommonIcon.Map/>}
      >
        {t("Mặc Định")}
      </Button>
      <Button 
        size="small" 
        style={{ minWidth: 120 }}
        onClick={() => onChangeMapTerrain({
          url: WorldMapConfig.satelliteTileLayer,
          maxZoom: WorldMapConfig.satelliteMaxZoom
        })} 
        prefixIcon={<CommonIcon.Map/>}
      >
        {t("Vệ Tinh")}
      </Button>
    </>
  )
}