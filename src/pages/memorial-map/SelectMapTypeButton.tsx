import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { CommonIcon, WorldMapConfig } from "components";

interface MapTypeButtonsProps {
  onSelect: (value: string) => void;
}

export function MapTypeButtons(props: MapTypeButtonsProps) {
  const { onSelect } = props;

  return (
    <div className="flex-h">
      <Button size="small" onClick={() => onSelect(WorldMapConfig.defaultTileLayer)} prefixIcon={<CommonIcon.Map/>}>
        {t("Mặc Định")}
      </Button>
      <Button size="small" onClick={() => onSelect(WorldMapConfig.satelliteTileLayer)} prefixIcon={<CommonIcon.Map/>}>
        {t("Vệ Tinh")}
      </Button>
    </div>
  )
}