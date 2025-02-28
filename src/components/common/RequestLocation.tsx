import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { ZmpSDK } from "utils";
import { CommonIcon } from "components";
import { useAppContext } from "hooks";

interface RequestLocationProps {
  visible: boolean;
  close: () => void;
}
export function RequestLocation({ visible, close }: RequestLocationProps) {
  const { zaloUserInfo, updateZaloUserInfo } = useAppContext();
  const [ request, setRequest ] = React.useState(false);

  const updateAuthSettings = () => {
    const success = (authSettings) => {
      updateZaloUserInfo({
        ...zaloUserInfo,
        authSettings: authSettings
      })
    }
    ZmpSDK.getAuthSettings(success);
  }

  if (request) {
    const success = (location: any) => { 
      updateAuthSettings();
      setRequest(false);
    }
    const fail = (error: any) => { 
      setRequest(false);
    }
    ZmpSDK.getLocation(success, fail);
  };

  return (
    <Sheet
      title={t("need_access")} 
      visible={visible}  
      onClose={close}
    >
      <div className="flex-v p-3">
        <div className="flex-h">
          <CommonIcon.Map size={20}/>
          <p className="ml-2"> {t("location_requirement")} </p>
        </div>
        <p> {t("request_location_explaination")} </p>
        <p> {t("commitment")} </p>
        <div className="flex-v pt-3">
          <Button variant="primary" size="medium" onClick={() => {
            close();
            setRequest(true);
          }}>
            {t("allow")}
          </Button>
          <Button variant="tertiary" size="medium" onClick={close}>
            {t("decline")}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}