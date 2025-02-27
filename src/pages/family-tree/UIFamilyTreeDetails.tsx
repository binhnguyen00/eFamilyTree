import React from "react";
import { t } from "i18next";
import { Button, Input, Text, Sheet, Modal, DatePicker } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { CommonUtils, DateTimeUtils, StyleUtils, ZmpSDK } from "utils";
import { useBeanObserver, useNotification, useAppContext } from "hooks";
import { CommonIcon, Selection, Label } from "components";
import { FailResponse, ServerResponse } from "types/server";

export enum CreateMode {
  ROOT = "root",
  CHILD = "child",
  SPOUSE = "spouse",
  SIBLING = "sibling",
}

export type Member = {
  id: number;
  code: string;
  name: string;
  gender: "0" | "1";
  phone: string;
  birthday: string;
  generation: number;
  spouses: {
    id: number;
    name: string;
    gender: "0" | "1";
  }[]
  children: {
    id: number;
    name: string;
  }[]
  father: string;
  fatherId: number;
  mother: string;
  motherId: number;
  achievements: {
    name: string,
    date: string,
    description: string
  }[]
  avatar?: string;
}

interface UITreeMemberDetailsProps {
  info: Member | null;
  visible: boolean;
  onClose: () => void;
  toBranch?: () => void;
  onCreateSpouse?: () => void;
  onCreateChild?: () => void;
  onCreateSibling?: () => void;
  onReloadParent?: () => void;
}
export function UITreeMemberDetails(props: UITreeMemberDetailsProps) {
  const { 
    info, visible, onClose, toBranch, 
    onCreateSpouse, onCreateChild, onCreateSibling, onReloadParent
  } = props;

  if (info === null) return;

  const { userInfo, serverBaseUrl } = useAppContext();
  const { successToast, dangerToast, warningToast, loadingToast } = useNotification();
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const observer = useBeanObserver(info || {} as Member);

  const isRoot = (): boolean => {
    if (!observer.getBean().generation) return true; 
    if (observer.getBean().generation === 1) return true;
    return false;
  }

  const isFemale = (): boolean => {
    return observer.getBean().gender === "0";
  }

  const onSave = () => {
    if (!observer.getBean().phone || !observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    FamilyTreeApi.saveMember({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      member: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          dangerToast(`${t("save")} ${t("fail")}`)
        } else {
          successToast(`${t("save")} ${t("success")}`)
          const bean = result.data as Member;
          observer.update("name", bean.name);
          observer.update("phone", bean.phone);
          observer.update("gender", bean.gender);
          observer.update("birthday", bean.birthday);
          if (onReloadParent) onReloadParent();
        }
        onClose();
      },
      fail: (error: FailResponse) => {
        dangerToast(`${t("save")} ${t("fail")}`)
      }
    })
  }

  const onArchive = () => {
    if (isRoot()) {
      dangerToast(t("Không thể xoá Thành viên Thuỷ Tổ"))
      return;
    }
    FamilyTreeApi.archiveMember({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      id: observer.getBean().id,
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          dangerToast(`${t("delete")} ${t("fail")}`)
        } else {
          successToast(`${t("delete")} ${t("success")}`)
        }
        setDeleteWarning(false);
        onClose();
        if (onReloadParent) onReloadParent();
      },
      fail: (error: FailResponse) => {
        dangerToast(`${t("delete")} ${t("fail")}`)
        setDeleteWarning(false);
      }
    })
  }

  const blobUrlsToBase64 = async (imagePaths: string[]) => {
    const base64Promises = imagePaths.map((blobUrl) => {
      return new Promise<string>((resolve) => {
        CommonUtils.blobUrlToBase64(blobUrl, (base64: string) => {
          resolve(base64);
        });
      });
    });
    const base64Array = await Promise.all(base64Promises);
    return base64Array;
  };

  const onUpdateAvatar = () => {
    const doUpdate = (base64: string) => {
      loadingToast(
        <div className="flex-v">
          <p> {t("đang cập nhật ảnh đại diện")} </p>
          <p> {t("vui lòng chờ")} </p>
        </div>,
        (successToastCB, dangerToastCB) => {
          FamilyTreeApi.updateAvatar({
            userId: userInfo.id,
            clanId: userInfo.clanId,
            memberId: observer.getBean().id,
            base64: base64,
            success: (result: ServerResponse) => {
              if (result.status === "error") {
                dangerToastCB(t("cập nhật không thành công"))
              } else {
                successToastCB(t("cập nhật thành công"))
                const publicPath = result.data as string;
                observer.update("avatar", publicPath);
              }
            },
            fail: () => dangerToastCB(t("cập nhật không thành công"))
          })
        }
      )
    }

    if (userInfo.id !== observer.getBean().id) {
      warningToast(t("không thể cập nhật ảnh đại diện của thành viên khác"));
      return;
    }
    const success = async (files: any[]) => {
      const blobs: string[] = [ ...files.map(file => file.path) ];
      const base64s = await blobUrlsToBase64(blobs);
      if (base64s.length) doUpdate(base64s[0]);
      else {
        dangerToast(t("ảnh bị lỗi"))
        return;
      }
    }
    const fail = () => {
      dangerToast(t("cập nhật không thành công"));
    }
    ZmpSDK.chooseImage(1, success, fail);
  }

  const onCopyCode = () => {
    const code = observer.getBean().code;
    const name = observer.getBean().name;
    navigator.clipboard.writeText(code)
    .then(() => {
      successToast(`${t("sao chép mã của")} ${name} ${t("thành công")}`);
    })
    .catch((err: Error) => {
      warningToast(`${t("sao chép mã của")} ${name} ${t("thất bại")}`)
    });
  }

  return (
    <Sheet
      height={StyleUtils.calComponentRemainingHeight(-60)}
      visible={visible} onClose={onClose} swipeToClose
    >
      <div className="p-3 scroll-v flev-v">
        <div>
          <Text.Title className="py-2"> {t("info")} </Text.Title>
          <div className="flex-v center">
            <img
              className="circle"
              style={{ width: "8rem", height: "8rem", objectFit: "cover" }}
              src={`${serverBaseUrl}/${observer.getBean().avatar}`}
              onError={(e) => {
                if (observer.getBean().gender === "1") {
                  e.currentTarget.src = "https://avatar.iran.liara.run/public/47";
                } else {
                  e.currentTarget.src = "https://avatar.iran.liara.run/public/98";
                }
              }}
            />
            {userInfo.id === observer.getBean().id && (
              <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onUpdateAvatar}>
                {observer.getFieldValue("avatar") === "" ? t("cập nhật") : t("sửa")}
              </Button>
            )}
          </div>

          <Input 
            name="name" label={<Label text={t("họ tên")}/>} 
            value={observer.getBean().name} onChange={observer.watch}
          />
          <Input 
            name="code" label={<Label text={t("mã")}/>} 
            value={observer.getBean().code} disabled
            suffix={<CommonIcon.Copy className="button" onClick={onCopyCode}/>}
          />
          <Input 
            name="phone" label={<Label text={t("điện thoại")}/>} 
            value={observer.getBean().phone} onChange={observer.watch}
          />
          <Selection
            defaultValue={
              observer.getBean().gender === "1" 
                ? { value: "1", label: t("male") }
                : { value: "0", label: t("female") }
            }
            options={[
              { value: "1", label: t("male") },
              { value: "0", label: t("female") }
            ]}
            observer={observer} field="gender" label={t("giới tính")}
          />
          <DatePicker 
            mask maskClosable 
            label={t("Ngày Sinh")} title={t("Ngày Sinh")}
            onChange={(date: Date, calendarDate: any) => {
              observer.update("birthday", DateTimeUtils.formatToDate(date));
            }}
            value={
              observer.getBean().birthday 
              ? DateTimeUtils.toDate(observer.getBean().birthday)
              : undefined
            }
          />
          <Input 
            label={<Label text={t("bố")}/>} 
            value={observer.getBean().father} name="father" disabled
          />
          <Input 
            label={<Label text={t("mẹ")}/>} 
            value={observer.getBean().mother} name="mother" disabled
          />
        </div>

        <div className="flex-v flex-grow-0">
          <div>
            <Text.Title className="py-2"> {t("Hành động")} </Text.Title>
            <div className="scroll-h">
              <Button size="small" prefixIcon={<CommonIcon.Tree size={16}/>} onClick={toBranch}>
                {t("Chi Nhánh")}
              </Button>

              <Button size="small" prefixIcon={<CommonIcon.Save size={16}/>} onClick={onSave}> 
                {t("save")}
              </Button>

              {!isRoot() && (
                <Button size="small" prefixIcon={<CommonIcon.Trash size={16}/>} onClick={() => setDeleteWarning(true)}>
                  {t("delete")}
                </Button>
              )}
            </div>
          </div>

          <div>
            <Text.Title className="py-2"> {t("Thêm Thành Viên")} </Text.Title>
            <div className="scroll-h flex-start">
              {!isFemale() && (
                <Button size="small" prefixIcon={<CommonIcon.Plus/>} style={{ minWidth: 120 }} onClick={onCreateChild}>
                  {t("Con")}
                </Button>
              )}
              <Button size="small" prefixIcon={<CommonIcon.Plus/>} style={{ minWidth: 120 }} onClick={onCreateSpouse}>
                {observer.getBean().gender === "1" ? t("Vợ") : t("Chồng")}
              </Button>
              <Button size="small" prefixIcon={<CommonIcon.Plus/>} style={{ minWidth: 140 }} onClick={onCreateSibling}>
                {t("Anh/Chị/Em")}
              </Button>
            </div>
          </div>
        </div>

      </div>
      <Modal
        visible={deleteWarning}
        title={t("Xoá Thành Viên")}
        description={t("Hành động không thể thu hồi. Bạn có chắc muốn xoá thành viên này?")}
        onClose={() => setDeleteWarning(false)}
        actions={[
          {
            text: "Xoá",
            onClick: onArchive
          },
          {
            text: "Đóng",
            close: true,
          },
        ]}
      />
    </Sheet>
  )
}