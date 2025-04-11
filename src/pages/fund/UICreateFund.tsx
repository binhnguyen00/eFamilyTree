import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet } from "zmp-ui";

import { FundQR } from "./UIFundQR";;
import { CommonIcon, ScrollableDiv, Selection, SelectionOption } from "components";
import { ServerResponse } from "types/server";
import { CommonUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { FundApi } from "api";
import { useGetActiveMembers } from "pages/family-tree/UIFamilyTree";

export interface CreateFundForm {
  name: string;
  fundQR: FundQR;
}
interface UICreateFundProps {
  visible: boolean;
  onClose: () => void;
  reloadParent: () => void;
}
export function UICreateFund(props: UICreateFundProps) {
  const { visible, onClose, reloadParent } = props;
  const { userInfo } = useAppContext();
  const { loadingToast, dangerToast } = useNotification();
  const { activeMembers } = useGetActiveMembers(userInfo.id, userInfo.clanId);

  const qrObserver = useBeanObserver({
    accountOwner:   userInfo.name,
    accountOwnerId: userInfo.id,
    accountNumber:  "",
    bankName:       "",
    imageQR:        "",
  } as FundQR);

  const observer = useBeanObserver({
    name: "",
  } as CreateFundForm);

  const renderQrCode = () => {
    const { width, height } = { width: 400, height: 400 };
    const src: string = qrObserver.getBean().imageQR 
      ? `data:image/png;base64,${qrObserver.getBean().imageQR}` 
      : `https://fakeimg.pl/${width}x${height}?text=QR`;
  
    return (
      <img
        className="rounded" src={src} width={width} height={height}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          e.currentTarget.src = `https://fakeimg.pl/${width}x${height}?text=QR`;
        }}
      />
    );
  }

  const onChooseImage = () => {
    ZmpSDK.chooseImage({
      howMany: 1,
      success: async (files: any[]) => {
        const blobs: string[] = [ ...files.map(file => file.path) ];
        const base64s = await CommonUtils.blobUrlsToBase64(blobs);
        if (base64s.length) {
          qrObserver.update("imageQR", base64s[0]);
        } else {
          dangerToast(t("chọn ảnh không thành công"));
        }
      },
      fail: () => {
        dangerToast(t("lỗi ảnh"));
      }
    });
  }

  const onSave = () => {
    loadingToast({
      content: <p> {t("đang chuẩn bị dữ liệu...")} </p>,
      operation(onSuccess, onFail, onDismiss) {
        FundApi.createFund({
          fund: {
            name: observer.getBean().name,
            fundQR: qrObserver.getBean()
          },
          userId: userInfo.id,
          clanId: userInfo.clanId,
          success: (res: ServerResponse) => {
            onSuccess(t("tạo thành công"));
            onClose();
            reloadParent();
          },
          fail: () => {
            onFail(t("tạo thất bại"));
          }
        });
      },
    })
  }

  return (
    <Sheet title={t("tạo quỹ")} visible={visible} onClose={onClose}>
      <ScrollableDiv className="flex-v p-3" direction="vertical" height={"70vh"}>
        <div className="center flex-v flex-grow-0">
          {renderQrCode()}
          <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onChooseImage}>
            {t("thêm")}
          </Button>
        </div>
        <Selection
          label={t("thủ quỹ")} 
          options={activeMembers} isSearchable
          defaultValue={{ value: userInfo.id, label: userInfo.name }}
          field={"accountOwnerId"} observer={qrObserver}
          onChange={(value: SelectionOption) => {
            qrObserver.update("accountOwner", value.label);
            qrObserver.update("accountOwnerId", value.value);
          }}
        />
        <Input label={t("tiêu đề")} name="name" value={observer.getBean().name} onChange={observer.watch}/>
        <Input label={t("ngân hàng")} name="bankName" value={qrObserver.getBean().bankName} onChange={qrObserver.watch}/>
        <Input 
          label={t("số tài khoản")} 
          type="number" name="accountNumber" 
          value={qrObserver.getBean().accountNumber} onChange={qrObserver.watch}
        />
        <div>
          <Button size="small" onClick={onSave} prefixIcon={<CommonIcon.Save/>}>
            {t("save")}
          </Button>
        </div>
      </ScrollableDiv>
    </Sheet>
  )
}