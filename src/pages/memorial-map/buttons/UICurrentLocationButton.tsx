import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { useAppContext } from "hooks";
import { CommonIcon } from "components";

interface CurrentPositionButtonProps {
  onClick: () => void;
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
      onClick();
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