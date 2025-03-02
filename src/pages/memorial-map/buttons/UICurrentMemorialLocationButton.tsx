import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { ZmpSDK } from "utils";
import { useAppContext } from "hooks";
import { CommonIcon, Coordinate, RequestLocation } from "components";

interface CurrentPositionButtonProps {
  onClick: (coordinate: Coordinate) => void;
}
export function CurrentPositionButton(props: CurrentPositionButtonProps) {
  const { onClick } = props;
  const { logedIn, zaloUserInfo } = useAppContext();

  const [ requestLoc, setRequestLoc ] = React.useState(false);   

  const onClickButton = () => {
    const locationPermission = zaloUserInfo.authSettings?.["scope.userLocation"];

    if (!locationPermission || !logedIn) {
      setRequestLoc(true);
    } else {
      ZmpSDK.getLocation(
        (location) => {
          onClick({
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude)
          })
        },
      )
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

      <RequestLocation
        visible={requestLoc}
        close={() => setRequestLoc(false)}
      />
    </>
  )
}