import React from "react";
import { t } from "i18next";
import { Button, Input, Text, Sheet, Modal } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { StyleUtils, TreeDataProcessor } from "utils";
import { useBeanObserver, useNotification } from "hooks";
import { CommonIcon, DatePicker, Selection, useAppContext } from "components";
import { FailResponse, ServerResponse } from "types/server";

export enum CreateMode {
  ROOT = "root",
  CHILD = "child",
  SPOUSE = "spouse",
  SIBLING = "sibling",
}

export type Member = {
  id: number;
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

  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const observer = useBeanObserver(info || {} as Member);

  const isRoot = (): boolean => {
    if (!observer.getBean().generation) return true; 
    if (observer.getBean().generation === 1) return true;
    return false;
  }

  console.log("is root", isRoot());

  const onSave = () => {
    console.log(observer.getBean());
    
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
        }
        onClose();
        if (onReloadParent) onReloadParent();
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

  const genderOpts = [
    { value: "1", label: t("male") },
    { value: "0", label: t("female") }
  ]

  return (
    <Sheet
      height={StyleUtils.calComponentRemainingHeight(0)}
      visible={visible} onClose={onClose} swipeToClose
    >
      <div className="p-3 scroll-v">
        <>
          <Text.Title className="py-2"> {t("info")} </Text.Title>
          <div className="flex-h justify-between">
            <Selection
              defaultValue={
                observer.getBean().gender === "1" 
                  ? { value: "1", label: t("male") }
                  : { value: "0", label: t("female") }
              }
              options={genderOpts}
              observer={observer} field="gender" label={"Giới Tính"}
            />
            <Input 
              size="small" name="phone" label={<Label text="Điện Thoại"/>} 
              value={observer.getBean().phone} onChange={observer.watch}
            />
          </div>
          <div className="flex-v flex-grow-0">
            <Input 
              size="small" name="name" label={<Label text="Họ Tên"/>} 
              value={observer.getBean().name} onChange={observer.watch}
            />
            <DatePicker
              label={t("Ngày Sinh")}
              field="birthday" observer={observer}
              defaultValue={observer.getBean().birthday ? new Date(observer.getBean().birthday) : undefined} 
            />
            <Input 
              size="small" label={<Label text="Bố"/>} 
              value={observer.getBean().father} name="father" disabled
            />
            <Input 
              size="small" label={<Label text="Mẹ"/>} 
              value={observer.getBean().mother} name="mother" disabled
            />
          </div>
        </>

        <>
          <div className="flex-v flex-grow-0">
            
            <div>
              <Text.Title size="small" className="py-2"> {t("Hành động")} </Text.Title>
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
              <Text.Title size="small" className="py-2"> {t("Thêm Thành Viên")} </Text.Title>
              <div className="scroll-h flex-start">
                <Button size="small" prefixIcon={<CommonIcon.Plus/>} style={{ minWidth: 120 }} onClick={onCreateChild}>
                  {t("Con")}
                </Button>
                <Button size="small" prefixIcon={<CommonIcon.Plus/>} style={{ minWidth: 120 }} onClick={onCreateSpouse}>
                  {t("Vợ/Chồng")}
                </Button>
                <Button size="small" prefixIcon={<CommonIcon.Plus/>} style={{ minWidth: 140 }} onClick={onCreateSibling}>
                  {t("Anh/Chị/Em")}
                </Button>
              </div>
            </div>

          </div>
        </>
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

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}