import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { ZmpSDK } from "utils";
import { useAppContext } from "hooks";
import { CommonIcon, Coordinate } from "components";

interface CurrentPositionButtonProps {
  onClick: (coordinate: Coordinate) => void;
  onRequestLocation?: () => void;
}
export function CurrentPositionButton(props: CurrentPositionButtonProps) {
  const { onClick, onRequestLocation } = props;
  const { zaloUserInfo } = useAppContext();
  const { "scope.userLocation": locationPermission } = zaloUserInfo.authSettings;

  const onClickButton = () => {
    if (!locationPermission) {
      if (onRequestLocation) onRequestLocation();
    } else {
      ZmpSDK.getLocation({
        successCB: (location) => {
          onClick({
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude)
          })
        },
      })
    }
  }

  return (
    <>
      <Button 
        style={{ minWidth: 100 }}
        size="small" prefixIcon={<CommonIcon.CurrentPosition/>} onClick={onClickButton}
      >
        {t("Tôi")}
      </Button>
    </>
  )
}