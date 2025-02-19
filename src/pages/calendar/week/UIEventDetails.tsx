import React from "react";

import { t } from "i18next";
import { Button, DatePicker, Grid, Input, Modal } from "zmp-ui";

import { CommonIcon, Label, Selection, useAppContext } from "components";
import { DateTimeUtils } from "utils";
import { CalendarApi } from "api";
import { ServerResponse } from "types/server";
import { useBeanObserver, useNotification } from "hooks";
import { ClanEvent } from "./UICreate";

interface UIEventDetailsProps {
  activeMembers: {
    value: number;
    label: string;
  }[];
  event: any | null;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UIEventDetails(props: UIEventDetailsProps) {
  const { activeMembers, event, onClose, onReloadParent } = props;
  
  if (event === null) return;

  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const observer = useBeanObserver({
    name:     event["name"] || "",
    picId:    event["pic_id"] || 0,
    picName:  event["pic"] || "", 
    place:    event["place"] || "",
    note:     event["note"] || "",
    fromDate: event["from_date"] || "",
    toDate:   event["to_date"] || ""
  } as ClanEvent)

  const onSave = () => {

  }

  const onDelete = () => {
    const loadingContent = (
      <div>
        <p> {t("preparing_data")} </p>
        <p> {t("please_wait")} </p>
      </div>
    )
    loadingToast(
      loadingContent,
      (successToast, failToast) => {
        CalendarApi.deleteEvent({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: event["id"],
          success: (result: ServerResponse) => {
            if (result.status === "success") {
              successToast(t("Xoá Thành Công"))
            } else {
              failToast(t("Xoá Thất Bại"))
            }
            if (onReloadParent) onReloadParent();
            onClose();
          },
          fail: () => {
            failToast(t("Xoá Thất Bại"))
            if (onReloadParent) onReloadParent();
            onClose()
          }
        })
      }
    )
  }

  const onFromDateChange = (date: Date, calendarDate: any) => {
    observer.update("fromDate", DateTimeUtils.formatDefault(date));
  }

  const onToDateChange = (date: Date, calendarDate: any) => {
    observer.update("toDate", DateTimeUtils.formatDefault(date));
  }

  return (
    <div className="flex-v flex-grow-0 p-3 scroll-v">

      <Input
        name="name" label={<Label text={t("Tên Sự Kiện")}/>}
        value={observer.getBean().name} onChange={observer.watch}
      />
      <Input.TextArea
        name="place" label={<Label text={t("Địa Điểm")}/>}
        value={observer.getBean().place} size="medium"
        onChange={(e) => observer.update("place", e.target.value)}
      />
      <Selection
        label={t("Người Phụ Trách")} field={"picId"} 
        options={activeMembers} observer={observer} isSearchable
        placeHolder={t("Chọn người phụ trách")}
        defaultValue={{ 
          value: observer.getBean().picId ? observer.getBean().picId : "", 
          label: `${observer.getBean().picName ? observer.getBean().picName : ""}`
        }}
      />
      <Grid columnCount={2} columnSpace="0.5rem">
        <DatePicker
          mask maskClosable 
          label={`${t("Từ Ngày")} *`} title={t("Từ Ngày")}
          onChange={onFromDateChange} 
          value={DateTimeUtils.toDate(DateTimeUtils.toDisplayDate(observer.getBean().fromDate))}
        />
        <div className="flex-v">
          <label> {t("Thời Gian")} </label>
          <input 
            type="time" name="fromTime" className="py-2" style={{ fontSize: "1.3rem" }}
            onChange={(e) => {
              const time = `${e.target.value}:00`
              observer.update("fromTime", time);
            }}
            defaultValue={DateTimeUtils.toDisplayTime(observer.getBean().fromDate)}
          />
        </div>
      </Grid>
      <Grid columnCount={2} columnSpace="0.5rem">
        <DatePicker
          mask maskClosable
          label={`${t("Đến Ngày")} *`} title={t("Đến Ngày")}
          onChange={onToDateChange} 
          value={DateTimeUtils.toDate(DateTimeUtils.toDisplayDate(observer.getBean().toDate))}
        />
        <div className="flex-v">
          <label> {t("Thời Gian")} </label>
          <input 
            type="time" name="toTime" className="py-2" style={{ fontSize: "1.3rem" }}
            onChange={(e) => {
              const time = `${e.target.value}:00`
              observer.update("toTime", time);
            }}
            defaultValue={DateTimeUtils.toDisplayTime(observer.getBean().toDate)}
          />
        </div>
      </Grid>
      <Input.TextArea
        size="medium" name="note" label={<Label text={t("Ghi Chú")}/>}
        value={observer.getBean().note} 
        onChange={(e) => observer.update("note", e.target.value)}
      />

      <Modal
        visible={deleteWarning}
        mask={false} maskClosable={false}
        title={t("Xoá Sự Kiện")}
        description={t("Hành động không thể thu hồi. Bạn có chắc muốn xoá sự kiện này?")}
        onClose={() => setDeleteWarning(false)}
        actions={[
        {
            text: t("Xoá"),
            onClick: onDelete
          },
          {
            text: t("Đóng"),
            close: true,
          },
        ]}
      />

      <div className="scroll-h">
        <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave}>
          {t("save")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Trash/>} onClick={() => setDeleteWarning(true)}>
          {t("delete")}
        </Button>
      </div>

    </div>
  )
}