import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { ZmpSDK } from "utils";
import { useAppContext } from "hooks";
import { CommonIcon, SlidingPanel, SlidingPanelOrient } from "components";

export function RequestPhone(props: { visible: boolean, closeSheet: () => void }) {
  const { updatePhoneNumber, updateZaloUserInfo } = useAppContext();
  const { visible, closeSheet } = props;
  const [ request, setRequest ] = React.useState(false);

  if (request) {
    const success = (number: string) => { 
      setRequest(false);
      ZmpSDK.getUserInfo(
        (zaloUser: any) => {
          updatePhoneNumber(number);
          updateZaloUserInfo(zaloUser);
        }
      )
    }
    const fail = (error: any) => { 
      setRequest(false);
      console.error("RequestPhone:\n\t", error) 
    }
    ZmpSDK.getPhoneNumber(success, fail);
  };

  return (
    <SlidingPanel 
      header={<p style={{ fontSize: "1.2rem" }}> {t("need_access")} </p>} 
      visible={visible} 
      orient={SlidingPanelOrient.BottomToTop}
      close={closeSheet}
    >
      <div className="flex-v p-3">
        <div className="flex-h">
          <CommonIcon.Phone size={16}/>
          <p className="ml-2"> {t("phone_requirement")} </p>
        </div>
        <p> {t("request_phone_explaination")} </p>
        <p> {t("commitment")} </p>
        <div className="flex-v pt-3">
          <Button variant="primary" size="medium" onClick={() => {
            closeSheet();
            setRequest(true);
          }}>
            {t("allow")}
          </Button>
          <Button variant="tertiary" size="medium" onClick={closeSheet}>
            {t("decline")}
          </Button>
        </div>
      </div>
    </SlidingPanel>
  )
}