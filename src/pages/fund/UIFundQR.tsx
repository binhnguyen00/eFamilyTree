import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet } from "zmp-ui";

import { FundApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, ZmpSDK } from "utils";
import { BeanObserver, CommonIcon, ScrollableDiv } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";

import { FundInfo } from "./UIFundInfo";

export interface FundQR {
  accountNumber: string;
  accountOwner: string;
  accountOwnerId: number;
  bankName: string;
  imageQR: string;
}

interface UIFundQRProps {
  visible: boolean;
  observer: BeanObserver<FundInfo>;
  onClose: () => void;
}
export function UIFundQR(props: UIFundQRProps) {
  const { visible, observer, onClose } = props;

  const { userInfo, serverBaseUrl } = useAppContext();
  const { loadingToast } = useNotification();

  const qrObserver = useBeanObserver(observer.getBean().qrCode);

  const onChangeQrCode = () => {
    loadingToast({
      content: t("đang chuẩn bị dữ liệu..."),
      operation: (successToastCB, dangerToastCB) => {
        
        const doUpdate = (base64: string) => {
          FundApi.saveFundQrCode({
            id: observer.getBean().id,
            qrCode: base64,
            userId: userInfo.id,
            clanId: userInfo.clanId,
            success: (response: ServerResponse) => {
              if (response.status === "success") {
                successToastCB(t("cập nhật thành công"));
                qrObserver.update("imageQR", response.data as string);
              } else {
                dangerToastCB(t("cập nhật không thành công"));
              }
            },
            fail: () => dangerToastCB(t("cập nhật không thành công"))
          })
        }
        
        ZmpSDK.chooseImage({
          howMany: 1,
          success: async (files: any[]) => {
            const blobs: string[] = [ ...files.map(file => file.path) ];
            const base64s = await CommonUtils.blobUrlsToBase64s(blobs);
            if (base64s.length) doUpdate(base64s[0]);
            else {
              dangerToastCB(t("lỗi ảnh"))
              return;
            }
          },
          fail: () => dangerToastCB(t("cập nhật không thành công"))
        });
      }
    })
  } 

  const renderQrCode = () => {
    const { width, height } = { width: 400, height: 400 };
    const src = `${serverBaseUrl}/${qrObserver.getBean().imageQR}`;
    return (
      <img
        className="rounded" src={src}
        onError={(e) => e.currentTarget.src = `https://fakeimg.pl/${width}x${height}?text=QR`}
      />
    )
  }

  const hasQrCode = () => {
    if (!qrObserver.getBean().imageQR) return false;
    if (!qrObserver.getBean().imageQR.length) return false;
    return true;
  }

  return (
    <Sheet title={observer.getBean().name} visible={visible} onClose={onClose} mask maskClosable>
      <ScrollableDiv className="flex-v p-3" direction="vertical" height={"70vh"}>
        <div className="flex-v flex-grow-0">
          <div className="center flex-v flex-grow-0">
            {renderQrCode()}
            <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onChangeQrCode}>
              {hasQrCode() ? t("mã khác") : t("thêm")}
            </Button>
          </div>
          <Input label={t("số tài khoản")} type="number" value={qrObserver.getBean().accountNumber} disabled/>
          <Input label={t("chủ tài khoản")} value={qrObserver.getBean().accountOwner} disabled/>
          <Input label={t("ngân hàng")} value={qrObserver.getBean().bankName} disabled/>
        </div>

        <br />
      </ScrollableDiv>
    </Sheet>
  )
}