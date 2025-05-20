import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { DateTimeUtils } from "utils";
import { FamilyTreeApi } from "api";
import { CommonIcon, Selection, Label } from "components";
import { TreeMember, FailResponse, ServerResponse } from "types";
import { useAppContext, useBeanObserver, useNotification } from "hooks";

interface UICreateSiblingProps {
  sibling: TreeMember | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}

export function UICreateSibling(props: UICreateSiblingProps) {
  const { sibling, visible, onClose, onReloadParent } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  if (!sibling) return;
  if (visible && (!sibling.fatherId)) {
    dangerToast(t("Thành viên cần có Bố để tạo Anh/Chị/Em"));
    return;
  }

  const observer = useBeanObserver({
    gender: "1",
    mother: sibling.mother,
    motherId: sibling.motherId,
    father: sibling.father,
    fatherId: sibling.fatherId,
  } as TreeMember);

  const onCreate = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    loadingToast({
      content: <p> {t("đang tạo...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.createMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          member: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("save")} ${t("fail")}`)
            } else {
              successToastCB(`${t("save")} ${t("success")}`)
              if (onReloadParent) onReloadParent()
            }
            onClose();
          },
          fail: (error: FailResponse) => dangerToastCB(`${t("save")} ${t("fail")}`)
        })
      }
    })
  }

  return (
    <Sheet
      visible={visible} onClose={onClose}
      title={t("Tạo Anh/Chị/Em")} height={"70vh"}
    >
      <div className="scroll-v flex-v p-3">
        {/* form */}
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <Input 
          name="name" label={<Label text={`${t("họ tên")} *`}/>} 
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input
          name="phone" type="number" label={<Label text={t("điện thoại")}/>} 
          value={observer.getBean().phone} onChange={observer.watch}
        />
        <Selection
          options={[
            { value: "1", label: t("male") },
            { value: "0", label: t("female") }
          ]}
          defaultValue={
            observer.getBean().gender === "1" 
            ? { value: "1", label: t("male") }
            : { value: "0", label: t("female") }
          }
          observer={observer} field="gender" label={t("Giới Tính")}
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
            : new Date(new Date().setFullYear(new Date().getFullYear() - 20))
          }
        />
        <DatePicker 
          mask maskClosable 
          label={t("Ngày Mất (Âm lịch)")} title={t("Ngày Mất (Âm lịch)")}
          onChange={(date: Date, calendarDate: any) => {
            observer.update("lunarDeathDay", DateTimeUtils.formatToDate(date));
          }}
          value={
            observer.getBean().lunarDeathDay 
            ? DateTimeUtils.toDate(observer.getBean().lunarDeathDay)
            : new Date(new Date().setFullYear(new Date().getFullYear() - 20))
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
        {/* footer */}
        <div>
          <Text.Title className="py-2"> {t("Hành động")} </Text.Title>
          <Button size="small" prefixIcon={<CommonIcon.AddPerson/>} onClick={onCreate}> 
            {t("create")}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}