import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { ZmpSDK } from "utils";
import { CommonIcon } from "components";
import { useAppContext, useNotification } from "hooks";

import { ZaloSettings } from "types/app-context";

interface RequestLocationProps {
  visible: boolean;
  onClose: () => void;
  onSuccessRequest?: () => void
}
export function RequestLocation(props: RequestLocationProps) {
  const { visible, onClose, onSuccessRequest } = props;
  const { zaloUserInfo, updateZaloUserInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const [ request, setRequest ] = React.useState(false);

  const updateAuthSettings = (
    successToastCB: (content: any) => void,
    dangerToastCB: (content: any) => void,
  ) => {
    ZmpSDK.getAuthSettings({
      successCB: (authSettings: ZaloSettings) => {
        successToastCB(t("đã chia sẻ quyền truy cập vị trí"));
        updateZaloUserInfo({
          ...zaloUserInfo,
          authSettings: authSettings
        })
        if (onSuccessRequest) onSuccessRequest();
      },
      failCB: (error: any) => dangerToastCB(t("chia sẻ không thành công"))
    });
  }

  React.useEffect(() => {    
    if (request) {
      loadingToast(
        <p> {t("đang xử lý...")} </p>,
        (successToastCB, dangerToastCB) => {
          ZmpSDK.getLocation({
            successCB: (location: any) => { 
              updateAuthSettings(successToastCB, dangerToastCB);
              setRequest(false);
            },
            failCB: (error: any) => { 
              setRequest(false);
              dangerToastCB(t("chia sẻ không thành công"));
            }
          });
        }
      );
    };
  }, [ request ]);

  return (
    <Sheet
      title={t("need_access")} 
      visible={visible}  
      onClose={onClose}
    >
      <div className="flex-v p-3">
        <div className="flex-h">
          <CommonIcon.Map size={24}/>
          <p className="ml-2"> {t("location_requirement")} </p>
        </div>
        <p> {t("request_location_explaination")} </p>
        <p> {t("commitment")} </p>
        <div className="flex-v pt-3">
          <Button 
            variant="primary" size="medium" 
            onClick={() => {
              onClose();
              setRequest(true);
            }}
          >
            {t("allow")}
          </Button>
          <Button 
            variant="tertiary" size="medium" 
            onClick={() => {
              onClose();
              setRequest(false);
            }}
          >
            {t("decline")}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}