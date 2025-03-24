import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { ZmpSDK } from "utils";
import { useAppContext, useNotification } from "hooks";
import { CommonIcon } from "components";
import { ZaloSettings } from "types/app-context";

interface RequestPhoneProps {
  visible: boolean, 
  closeSheet: () => void,
  onSuccessRequest?: () => void
}
export function RequestPhone(props: RequestPhoneProps) {
  const { visible, closeSheet, onSuccessRequest } = props;
  const { updatePhoneNumber, updateZaloUserInfo, zaloUserInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const [ request, setRequest ] = React.useState(false);

  const updateZaloUser = (
    zaloUser: any,
    successToastCB: (content: any) => void,
    dangerToastCB: (content: any) => void,
  ) => {
    ZmpSDK.getAuthSettings({
      successCB: (authSettings: ZaloSettings) => {
        successToastCB(t("cập nhật quyền người dùng"));
        updateZaloUserInfo({
          id: zaloUser.id,
          name: zaloUser.name,
          avatar: zaloUser.avatar,
          authSettings: authSettings
        })
        if (onSuccessRequest) onSuccessRequest();
      },
      failCB: (error: any) => dangerToastCB(t("cập nhật quyền người dùng không thành công"))
    });
  }

  React.useEffect(() => {    
    if (request) {
      loadingToast(
        <p> {t("đang xử lý...")} </p>,
        (successToastCB, dangerToastCB) => {
          ZmpSDK.getPhoneNumber(
            // success
            (number: string) => {
              successToastCB(t("đã chia sẻ số điện thoại"))
              setRequest(false);
              ZmpSDK.getUserInfo({
                success: (zaloUser: any) => {
                  updatePhoneNumber(number);
                  updateZaloUser(zaloUser, successToastCB, dangerToastCB)
                },
                fail: (error: any) => dangerToastCB(t("cập nhật quyền người dùng không thành công"))
              })
              if (onSuccessRequest) onSuccessRequest();
            },
            // fail
            (error: any) => {
              setRequest(false);
              dangerToastCB(t("chia sẻ không thành công"));
            }
          );
        }
      )
    };
  }, [ request ]);

  return (
    <Sheet 
      title={t("need_access")} 
      visible={visible} 
      onClose={closeSheet}
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
    </Sheet>
  )
}