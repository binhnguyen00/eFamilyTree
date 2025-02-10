import React from "react";
import { t } from "i18next";
import { Button, Input, Text, Sheet } from "zmp-ui";

import { StyleUtils, TreeDataProcessor } from "utils";
import { FamilyTreeApi } from "api";
import { 
  CommonIcon, DatePicker, ScrollableDiv, Selection, useAppContext } from "components";
import { useBeanObserver, useNotification } from "hooks";

import { FailResponse, ServerResponse } from "types/server";
import { UICreateSpouse } from "./UICreateSpouse";

export enum CreateMode {
  CHILD = "child",
  SPOUSE = "spouse",
  SIBLING = "sibling",
}

export type Member = {
  id: number;
  name: string;
  gender: "0" | "1";
  phone: string;
  birthDay: string;
  spouses: {
    id: number;
    name: string;
    gender: "0" | "1";
  }[]
  father: string;
  fatherId: number;
  mother: string;
  motherId: number;
}

interface UITreeMemberDetailsPanelProps {
  info: Member | null;
  visible: boolean;
  onClose: () => void;
  toBranch?: () => void;
  processor?: TreeDataProcessor;
  onSave?: (bean: Member) => void;
  onCreateSpouse?: () => void;
  onCreateChild?: () => void;
  onCreateSibling?: () => void;
}
export function UITreeMemberDetailsPanel(props: UITreeMemberDetailsPanelProps) {
  const { 
    info, visible, onClose, toBranch, processor, 
    onCreateSpouse, onCreateChild, onCreateSibling
  } = props;

  if (info === null) return;

  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const isRoot = (): boolean => {
    if (!observer.getBean().id) return true; 
    if (observer.getBean().id === 1) return true;
    return false;
  }

  const observer = useBeanObserver(info || {} as Member);

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
          // observer.updateBean(bean)
        }
        onClose();
      },
      fail: (error: FailResponse) => {
        dangerToast(`${t("save")} ${t("fail")}`)
      }
    })
  }

  const onArchive = () => {
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
        onClose();
      },
      fail: (error: FailResponse) => dangerToast(`${t("delete")} ${t("fail")}`)
    })
  }

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
              options={[
                { value: "1", label: t("male") },
                { value: "0", label: t("female") }
              ]}
              observer={observer} field="gender" label={"Giới Tính"}
            />
            <Input 
              size="small" name="phone" label={<Label text="Điện Thoại"/>} 
              value={observer.getBean().phone} onChange={observer.watch}
            />
          </div>
          <div className="flex-v">
            <Input 
              size="small" name="name" label={<Label text="Họ Tên"/>} 
              value={observer.getBean().name} onChange={observer.watch}
            />
            <DatePicker
              label={t("Ngày Sinh")}
              field="birthDay" observer={observer}
              defaultValue={observer.getBean().birthDay ? new Date(observer.getBean().birthDay) : undefined} 
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
          <div className="flex-v">
            
            <div>
              <Text.Title size="small" className="py-2"> {t("Hành động")} </Text.Title>
              <div className="scroll-h">
                {isRoot() ? (
                  <></>
                ) : (
                  <Button size="small" prefixIcon={<CommonIcon.Tree size={16}/>} onClick={toBranch}>
                    {t("btn_tree_member_detail")}
                  </Button>
                )} 

                <Button size="small" prefixIcon={<CommonIcon.Save size={16}/>} onClick={onSave}> 
                  {t("save")}
                </Button>

                {isRoot() ? (
                  <></>
                ) : (
                  <Button size="small" prefixIcon={<CommonIcon.Trash size={16}/>} onClick={onArchive}>
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
    </Sheet>
  )
}

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}