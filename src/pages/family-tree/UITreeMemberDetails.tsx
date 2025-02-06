import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { StyleUtils } from "utils";
import { FamilyTreeApi } from "api";
import { 
  CommonIcon, Selection, 
  SlidingPanel, SlidingPanelOrient, useAppContext } from "components";
import { useBeanObserver, useNotification } from "hooks";

import { FailResponse, ServerResponse } from "types/server";

export type Member = {
  id: number;
  name: string;
  gender: "0" | "1";
  phone: string;
  spouses: {
    id: number;
    name: string;
    gender: "0" | "1";
  }[]
  father: string;
  mother: string;
}

interface UITreeMemberDetailsPanelProps {
  info: Member;
  visible: boolean;
  onClose: () => void;
  toBranch?: () => void;
}
export function UITreeMemberDetailsPanel(props: UITreeMemberDetailsPanelProps) {
  const { info, visible, onClose, toBranch } = props;
  
  const observer = useBeanObserver(info);
  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const onSave = () => {
    FamilyTreeApi.saveMember({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      member: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          dangerToast(`${t("save")} ${t("fail")}`)
        } else {
          successToast(`${t("save")} ${t("success")}`)
        }
        onClose();
      },
      fail: (error: FailResponse) => dangerToast(`${t("save")} ${t("fail")}`)
    })
  }

  const onDelete = () => {
    FamilyTreeApi.deleteMember({
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
    <SlidingPanel
      orient={SlidingPanelOrient.BottomToTop}
      visible={visible}
      close={onClose}
      className="pb-3 bg-white"
      header={t("member_info")}
      height={StyleUtils.calComponentRemainingHeight(0)}
    >
      <div className="px-2" style={{ height: "70vh" }}>
        <>
          <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>
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
          <Input 
            size="small" name="name" label={<Label text="Họ Tên"/>} 
            value={observer.getBean().name} onChange={observer.watch}
          />
          <Input 
            size="small" label={<Label text="Bố"/>} 
            value={observer.getBean().father} name="father" disabled
          />
          <Input 
            size="small" label={<Label text="Mẹ"/>} 
            value={observer.getBean().mother} name="mother" disabled
          />
        </>

        <>
          <Text.Title className="text-capitalize text-primary py-2"> {t("utilities")} </Text.Title>
          <div className="flex-h">
            <Button size="small" prefixIcon={<CommonIcon.Tree size={16}/>} onClick={toBranch}>
              {t("btn_tree_member_detail")}
            </Button>
            <Button size="small" prefixIcon={<CommonIcon.Save size={16}/>} onClick={onSave}> 
              {t("save")}
            </Button>
            <Button size="small" prefixIcon={<CommonIcon.Trash size={16}/>} onClick={onDelete}>
              {t("delete")}
            </Button>
          </div>
        </>
      </div>
    </SlidingPanel>
  )
}

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}