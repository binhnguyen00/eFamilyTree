import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet } from "zmp-ui";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { FundApi } from "api";
import { CommonUtils, ZmpSDK } from "utils";
import { ServerResponse } from "types/server";
import { useAppContext, useBeanObserver, useNotification, useFamilyTree } from "hooks";
import { CommonIcon, ScrollableDiv, Selection, SelectionOption } from "components";

import { FundQR } from "./UIFundQR";;

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
  const { userInfo, serverBaseUrl } = useAppContext();
  const { useGetActiveMembers } = useFamilyTree();
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
    const { width, height } = { width: 300, height: 300 };
    const hasQrCode: boolean = !!qrObserver.getBean().imageQR;
    const src = React.useMemo(() => {
      return hasQrCode
        ? `${serverBaseUrl}/${qrObserver.getBean().imageQR}`
        : `https://placehold.jp/30/ededed/000000/${width}x${height}.png?text=M%C3%A3%20QR`;
    }, [ qrObserver.getBean().imageQR ]);

    return (
      <PhotoProvider maskOpacity={0.5} maskClosable pullClosable bannerVisible={false}>
        <PhotoView src={src}>
          <img
            src={src}
            style={{ width: width, height: height }} className="rounded object-cover"
            onError={(e) => (e.currentTarget.src !== src) && (e.currentTarget.src = src)}
          />
        </PhotoView>
      </PhotoProvider>
    );
  }

  const onChooseImage = () => {
    ZmpSDK.chooseImage({
      howMany: 1,
      success: async (files: any[]) => {
        const blobs: string[] = [ ...files.map(file => file.path) ];
        const base64s = await CommonUtils.blobUrlsToBase64s(blobs);
        if (base64s.length) {
          qrObserver.update("imageQR", base64s[0]);
        } else {
          dangerToast(t("Chọn ảnh không thành công"));
        }
      },
      fail: () => {
        dangerToast(t("Lỗi ảnh"));
      }
    });
  }

  const onSave = () => {
    loadingToast({
      content: <p> {t("Đang chuẩn bị dữ liệu...")} </p>,
      operation(onSuccess, onFail, onDismiss) {
        FundApi.createFund({
          fund: {
            name: observer.getBean().name,
            fundQR: qrObserver.getBean()
          },
          userId: userInfo.id,
          clanId: userInfo.clanId,
          success: (res: ServerResponse) => {
            onSuccess(t("Tạo thành công"));
            onClose();
            reloadParent();
          },
          fail: () => {
            onFail(t("Tạo thất bại"));
          }
        });
      },
    })
  }

  return (
    <Sheet title={t("Tạo quỹ")} visible={visible} onClose={onClose}>
      <ScrollableDiv className="flex-v p-3" direction="vertical" height={"70vh"}>
        <div className="center flex-v flex-grow-0">
          {renderQrCode()}
          <Button size="small" variant="tertiary" className="button-link" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onChooseImage}>
            {!!qrObserver.getBean().imageQR ? t("sửa") : t("add")}
          </Button>
        </div>
        <Selection
          label={t("Thủ quỹ")} 
          options={activeMembers} isSearchable
          defaultValue={{ value: userInfo.id, label: userInfo.name }}
          field={"accountOwnerId"} observer={qrObserver}
          onChange={(value: SelectionOption) => {
            qrObserver.update("accountOwner", value.label);
            qrObserver.update("accountOwnerId", value.value);
          }}
        />
        <Input label={t("Tiêu đề")} name="name" value={observer.getBean().name} onChange={observer.watch}/>
        <Input label={t("Ngân hàng")} name="bankName" value={qrObserver.getBean().bankName} onChange={qrObserver.watch}/>
        <Input 
          label={t("Số tài khoản")} 
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