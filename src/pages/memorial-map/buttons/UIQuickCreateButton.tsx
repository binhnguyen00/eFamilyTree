import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { ZmpSDK } from "utils";
import { CommonIcon, Coordinate } from "components";
import { useNotification, useRequestLocationContext } from "hooks";

import { MemorialLocation } from "../UIMap";

interface QuickCreateLocationButtonProps {
  onSuccessCreate?: (marker: MemorialLocation) => void;
  onCreate?: (coordinate: Coordinate) => void;
}
export function QuickCreateLocationButton(props: QuickCreateLocationButtonProps) {
  const { onCreate: onSuccessLocateCoordinate } = props;
  const { loadingToast } = useNotification();
  const { needLocation, requestLocation } = useRequestLocationContext();

  const onCreate = () => {
    if (needLocation) {
      requestLocation();
      return;
    }
    loadingToast(
      <p> {t("đang lấy toạ độ hiện tại...")} </p>,
      (successToastCB, dangerToastCB) => {
        ZmpSDK.getLocation({
          successCB: (location: any) => {
            successToastCB(t("lấy toạ độ thành công"));
            const coordinate = {
              lat: parseFloat(location.latitude),
              lng: parseFloat(location.longitude)
            } as Coordinate;
            if (onSuccessLocateCoordinate) onSuccessLocateCoordinate(coordinate);
          },
          failCB: () => dangerToastCB(t("lấy toạ độ không thành công"))
        });
      }
    )
  }

  return (
    <>
      <Button
        style={{ minWidth: 140 }} size="small" 
        prefixIcon={<CommonIcon.AddMarker/>}
        onClick={onCreate}
      >
        {t("Tạo nhanh")}
      </Button>
    </>
  )
}