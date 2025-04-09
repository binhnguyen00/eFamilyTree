import React from "react";
import { t } from "i18next";
import { Button, Input, Text, Sheet, Modal, DatePicker, Avatar } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { CommonUtils, DateTimeUtils, StyleUtils, TreeDataProcessor, ZmpSDK } from "utils";
import { useBeanObserver, useNotification, useAppContext } from "hooks";
import { CommonIcon, Selection, Label, SelectionOption } from "components";
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
  processor: TreeDataProcessor;
  onClose: () => void;
  toSubNodes?: (nodeId: string) => void;
  onCreateSpouse?: () => void;
  onCreateChild?: () => void;
  onCreateSibling?: () => void;
  onReloadParent?: () => void;
}
export function UITreeMemberDetails(props: UITreeMemberDetailsProps) {
  const { 
    info, visible, onClose, toSubNodes, processor,
    onCreateSpouse, onCreateChild, onCreateSibling, onReloadParent
  } = props;

  if (info === null) return;

  const observer = useBeanObserver(info || {} as Member);
  const { userInfo, serverBaseUrl } = useAppContext();
  const { successToast, dangerToast, warningToast, loadingToast } = useNotification();
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const moms = processor.getSpouses(info.fatherId || 0);
  const momOpts = moms.map((mom) => {
    return {
      value: mom.id, 
      label: mom.name
    }
  }) as SelectionOption[];

  const isOwner = (): boolean => observer.getBean().id === userInfo.id;
  const isFemale = (): boolean => observer.getBean().gender === "0";
  const isMale = (): boolean => observer.getBean().gender === "1";
  const hasParents = (): boolean => !!observer.getBean().fatherId || !!observer.getBean().motherId;
  const hasChildren = (): boolean => observer.getBean().children.length > 0;
  const hasAvatar = (): boolean => !!observer.getBean().avatar;
  const isRoot = (): boolean => {
    const isGenOne = (): boolean => observer.getBean().generation === 1;
    if (isMale() && !hasParents() && isGenOne()) 
      return true;
    else if (isFemale() && isGenOne())
      return false;
    return false;
  }

  const onSave = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    loadingToast({
      content: <p> {t("đang lưu...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.saveMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          member: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("save")} ${t("fail")}`)
            } else {
              successToastCB(`${t("save")} ${t("success")}`)
              const bean = result.data as Member;
              observer.update("name", bean.name);
              observer.update("phone", bean.phone);
              observer.update("gender", bean.gender);
              observer.update("birthday", bean.birthday);
              if (onReloadParent) onReloadParent();
            }
            onClose();
          },
          fail: (error: FailResponse) => dangerToastCB(`${t("save")} ${t("fail")}`)
        })
      }
    })
  }

  const onArchive = () => {
    if (isRoot()) { dangerToast(t("Không thể xoá Thành viên Thuỷ Tổ")); return; }
    if (hasChildren()) { dangerToast(t("Thành viên có con, không thể xoá")); return; }
    loadingToast({
      content: <p> {t("đang xoá...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.archiveMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: observer.getBean().id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("delete")} ${t("fail")}`)
            } else {
              successToastCB(`${t("delete")} ${t("success")}`)
            }
            setDeleteWarning(false);
            onClose();
            if (onReloadParent) onReloadParent();
          },
          fail: (error: FailResponse) => {
            dangerToastCB(`${t("delete")} ${t("fail")}`)
            setDeleteWarning(false);
          }
        })
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

  const onCopyFieldValue = (field: string) => {
    const value = observer.getFieldValue(field);
    navigator.clipboard.writeText(value)
      .then(() => successToast(t("sao chép thành công")))
      .catch((err: Error) => warningToast(t("sao chép thất bại")));
  }

  const onUpdateAvatar = () => {
    const doUpdate = (base64: string) => {
      loadingToast({
        content: (
          <div className="flex-v">
            <p> {t("đang cập nhật ảnh đại diện")} </p>
            <p> {t("vui lòng chờ")} </p>
          </div>
        ),
        operation: (successToastCB, dangerToastCB) => {
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
      })
    }

    if (!isOwner()) {
      warningToast(t("không thể cập nhật ảnh đại diện của thành viên khác"));
      return;
    }
    ZmpSDK.chooseImage({
      howMany: 1,
      success: async (files: any[]) => {
        const blobs: string[] = [ ...files.map(file => file.path) ];
        const base64s = await blobUrlsToBase64(blobs);
        if (base64s.length) doUpdate(base64s[0]);
        else {
          dangerToast(t("ảnh bị lỗi"))
          return;
        }
      },
      fail: () => dangerToast(t("cập nhật không thành công"))
    });
  }

  const renderAvatar = () => {
    const src = hasAvatar()
      ? `${serverBaseUrl}/${observer.getBean().avatar}`
      : isMale()
        ? "https://avatar.iran.liara.run/public/47"
        : "https://avatar.iran.liara.run/public/98";

    return (
      <div className="flex-v center"> 
        <Avatar src={src} size={140}/>
        {userInfo.id === observer.getBean().id && ( 
          <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onUpdateAvatar}>
            {observer.getFieldValue("avatar") === "" ? t("cập nhật") : t("sửa")}
          </Button>
        )}
      </div>
    )
  }

  return (
    <Sheet
      height={StyleUtils.calComponentRemainingHeight(-60)}
      visible={visible} onClose={onClose} swipeToClose
    >
      <div className="p-3 scroll-v flex-v">
        {/* form */}
        <div className="flex-v flex-grow-0">
          <Text.Title> {t("info")} </Text.Title>
          {/* avatar */}
          {renderAvatar()}
          {/* information */}
          <Input 
            name="name" label={<Label text={t("họ tên")}/>} 
            value={observer.getBean().name} onChange={observer.watch}
          />
          <Input 
            name="code" label={<Label text={t("mã")}/>} 
            value={observer.getBean().code} disabled
            suffix={<CommonIcon.Copy size={24} onClick={() => onCopyFieldValue("code")}/>}
          />
          <Input 
            name="phone" type="number" label={<Label text={t("điện thoại")}/>} 
            value={observer.getBean().phone} onChange={observer.watch}
            suffix={<CommonIcon.Copy size={24} onClick={() => onCopyFieldValue("phone")}/>}
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
          <Selection
            options={momOpts}
            observer={observer} field="" label={t("mẹ")}
            onChange={(selected: SelectionOption, action) => {
              observer.update("mother", selected.label)
              observer.update("motherId", selected.value)
            }}
          />
        </div>

        {/* footer */}
        <div className="flex-v flex-grow-0">

          <div className="flex-v">
            <Text.Title> {t("Hành động")} </Text.Title>
            <div className="scroll-h">
              <Button 
                size="small" prefixIcon={<CommonIcon.Tree size={"1rem"}/>} style={{ minWidth: 140 }} 
                onClick={() => toSubNodes?.(observer.getBean().id.toString())}
              >
                {t("Chi Nhánh")}
              </Button>

              <Button size="small" prefixIcon={<CommonIcon.Save size={"1rem"}/>} style={{ minWidth: 120 }} onClick={onSave}> 
                {t("save")}
              </Button>

              {!isRoot() && (
                <Button size="small" prefixIcon={<CommonIcon.Trash size={"1rem"}/>} style={{ minWidth: 120 }} onClick={() => setDeleteWarning(true)}>
                  {t("delete")}
                </Button>
              )}
            </div>
          </div>

          <div className="flex-v">
            <Text.Title> {t("Thêm Thành Viên")} </Text.Title>
            <div className="scroll-h">
              {!isFemale() && (
                <Button size="small" prefixIcon={<CommonIcon.AddPerson size={"1rem"}/>} style={{ minWidth: 120 }} onClick={onCreateChild}>
                  {t("Con")}
                </Button>
              )}
              {hasParents() || isRoot() && (
                <Button size="small" prefixIcon={<CommonIcon.MaleFemale size={"1rem"}/>} style={{ minWidth: 120 }} onClick={onCreateSpouse}>
                  {isMale() ? t("Vợ") : t("Chồng")}
                </Button>
              )}
              {hasParents() && (
                <Button size="small" prefixIcon={<CommonIcon.AddPerson size={"1rem"}/>} style={{ minWidth: 140 }} onClick={onCreateSibling}>
                  {t("Anh/Chị/Em")}
                </Button>
              )}
            </div>
          </div>

        </div>

      </div>

      <Modal
        visible={deleteWarning}
        title={t("Hành động không thể hoàn tác")}
        description={t("Bạn có chắc muốn xoá thành viên này?")}
        mask maskClosable
        onClose={() => setDeleteWarning(false)}
        actions={[
          { text: t("delete"), onClick: onArchive, danger: true },
          { text: t("Đóng"), close: true },
        ]}
      />

    </Sheet>
  )
}