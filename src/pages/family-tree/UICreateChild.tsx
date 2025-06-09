import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { DateTimeUtils, TreeDataProcessor } from "utils";
import { TreeMember, FailResponse, ServerResponse } from "types";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { CommonIcon, Selection, SelectionOption, Label } from "components";

interface UICreateChildProps {
  visible: boolean;
  dad: TreeMember | null;
  processor: TreeDataProcessor;
  onClose: () => void;
  onReloadParent?: () => void;
} 

export function UICreateChild(props: UICreateChildProps) {
  const { visible, dad, processor, onClose, onReloadParent } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  if (!dad) return;

  const moms = processor.getSpouses(dad.id);
  const momOpts = moms.map((mom) => {
    return {
      value: mom.id, 
      label: mom.name
    }
  }) as SelectionOption[];

  const observer = useBeanObserver({
    father: dad.name,
    fatherId: dad.id,
    gender: "1",
  } as TreeMember);

  // Set default mother
  React.useEffect(() => {
    if (!momOpts.length) return;
    else {
      const defaultMother = momOpts[0];
      observer.update("mother", defaultMother.label)
      observer.update("motherId", defaultMother.value)
    }
  }, [ ])

  const onCreate = () => {
    if (!observer.getBean().name) {
      dangerToast(t("Nhập đủ thông tin"))
      return;
    }
    loadingToast({
      content: <p> {t("Đang tạo...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.createMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          member: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("Lưu thất bại")}`);
            } else {
              successToastCB(`${t("Lưu thành công")}`);
              if (onReloadParent) onReloadParent();
            }
            onClose();
          },
          fail: (error: FailResponse) => dangerToastCB?.(`${t("Lưu thất bại")}`)
        })
      }
    })
  }

  return (
    <Sheet
      visible={visible} onClose={onClose}
      title={t("Tạo Con")} height={"70vh"}
    >
      <div className="scroll-v flex-v p-3">
        {/* form */}
        <Text.Title> {t("info")} </Text.Title>
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
        <Selection
          options={momOpts}
          observer={observer} field="" label={t("mẹ")}
          onChange={(selected: SelectionOption, action) => {
            observer.update("mother", selected.label)
            observer.update("motherId", selected.value)
          }}
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