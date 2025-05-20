import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { Button, Input, Sheet } from "zmp-ui";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { FundApi } from "api";
import { CommonUtils, ZmpSDK } from "utils";
import { ServerResponse, PagePermissions } from "types";
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
  permissions: PagePermissions;
  onClose: () => void;
}
export function UIFundQR(props: UIFundQRProps) {
  const { userInfo, serverBaseUrl } = useAppContext();
  const { loadingToast, successToast, dangerToast } = useNotification();
  const { visible, observer, onClose, permissions } = props;

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

  const hasQrCode = () => {
    if (!qrObserver.getBean().imageQR) return false;
    if (!qrObserver.getBean().imageQR.length) return false;
    return true;
  }

  const renderQrCode = () => {
    const { width, height } = { width: 300, height: 300 };
    const src = React.useMemo(() => {
      return hasQrCode()
        ? `${serverBaseUrl}/${qrObserver.getBean().imageQR}`
        : `https://fakeimg.pl/${width}x${height}/?text=:(`;
    }, [ qrObserver.getBean().imageQR ]);
    return (
      <PhotoProvider maskClosable maskOpacity={0.5} pullClosable bannerVisible={false}>
        <PhotoView src={src}>
          <img
            src={src}
            style={{ width: width, height: height }} className="rounded object-cover"
            onError={(e) => (e.currentTarget.src !== src) && (e.currentTarget.src = src)}
          />
        </PhotoView>
      </PhotoProvider>
    )
  }

  const onSave = () => {
    FundApi.saveFund({
      fund: {
        ...observer.getBean(),
        qrCode: qrObserver.getBean()
      },
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (response: ServerResponse) => {
        if (response.status === "success") {
          successToast(t("cập nhật thành công"));
        } else {
          dangerToast(t("cập nhật không thành công"));
        }
      },
      fail: () => dangerToast(t("cập nhật không thành công"))
    })
  }

  return (
    <Sheet title={observer.getBean().name} visible={visible} onClose={onClose} mask maskClosable>
      <ScrollableDiv className="flex-v p-3" direction="vertical" height="70vh">
        <div className="center flex-v flex-grow-0">
          {renderQrCode()}
          <Button className={classNames("button-link", !permissions.canModerate && "hide")} variant="tertiary" size="small" onClick={onChangeQrCode}>
            {hasQrCode() ? t("đổi mã") : t("thêm mã")}
          </Button>
        </div>
        <Input 
          label={t("chủ tài khoản")} name="accountOwner" disabled={!permissions.canModerate}
          onChange={qrObserver.watch} value={qrObserver.getBean().accountOwner} 
        />
        <div className="flex-h">
          <Input 
            label={t("số tài khoản")} type="number" name="accountNumber" disabled={!permissions.canModerate}
            onChange={qrObserver.watch} value={qrObserver.getBean().accountNumber}
            suffix={<CommonIcon.Copy size={"1rem"} onClick={() => CommonUtils.copyToClipboard({ value: qrObserver.getBean().accountNumber })}/>}
          />
          <Input 
            label={t("ngân hàng")} name="bankName" disabled={!permissions.canModerate} 
            onChange={qrObserver.watch} value={qrObserver.getBean().bankName}
          />
        </div>
        <div className="center">
          <Button className={classNames(!permissions.canModerate && "hide")} size="small" onClick={onSave}>
            {t("save")}
          </Button>
        </div>
        <br />
      </ScrollableDiv>
    </Sheet>
  )
}