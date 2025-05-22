import React from "react";

import { t } from "i18next";
import { Button, DatePicker, Grid, Input, Modal, Text } from "zmp-ui";

import { CommonIcon, Label, Selection } from "components";
import { DateTimeUtils } from "utils";
import { CalendarApi } from "api";
import { ServerResponse } from "types/server";
import { useBeanObserver, useNotification, useAppContext } from "hooks";
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
  const { successToast, dangerToast, loadingToast } = useNotification();
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const observer = useBeanObserver({
    id:       event["id"],
    name:     event["name"] || "",
    picId:    event["pic_id"] || 0,
    picName:  event["pic"] || "", 
    place:    event["place"] || "",
    note:     event["note"] || "",
    fromDate: event["from_date"] ? DateTimeUtils.toDisplayDate(event["from_date"]) : "",
    fromTime: event["from_date"] ? DateTimeUtils.toDisplayTimeSecond(event["from_date"]) : "",
    toDate:   event["to_date"] ? DateTimeUtils.toDisplayDate(event["to_date"]) : "",
    toTime:   event["to_date"] ? DateTimeUtils.toDisplayTimeSecond(event["to_date"]) : "",
  } as ClanEvent)

  const onSave = () => {
    const invalidData = (
      !observer.getBean().fromDate || 
      !observer.getBean().toDate || 
      !observer.getBean().name
    )
    if (invalidData) {
      dangerToast(t("Hãy nhập đủ dữ liệu"));
      return;
    } 

    CalendarApi.saveEventDeprecated({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      event: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          successToast(t("Lưu Thành Công"))
        } else {
          dangerToast(t("Lưu Thất Bại"))
        }
        if (onReloadParent) onReloadParent();
        onClose();
      },
      fail: () => {
        dangerToast(t("Lưu Thất Bại"))
        if (onReloadParent) onReloadParent();
        onClose()
      }
    })
  }

  const onDelete = () => {
    const loadingContent = (
      <div>
        <p> {t("preparing_data")} </p>
        <p> {t("please_wait")} </p>
      </div>
    )
    loadingToast({
      content: loadingContent,
      operation: (successToast, failToast) => {
        CalendarApi.deleteEvent({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: event["id"],
          success: (result: ServerResponse) => {
            if (result.status === "success") {
              successToast(t("xoá thành công"))
            } else {
              failToast(t("xoá thất bại"))
            }
            if (onReloadParent) onReloadParent();
            onClose();
          },
          fail: () => {
            failToast(t("xoá thất bại"))
            if (onReloadParent) onReloadParent();
            onClose()
          }
        })
      }
    })
  }

  const onFromDateChange = (date: Date, calendarDate: any) => {
    const value = DateTimeUtils.formatDefault(date);
    observer.update("fromDate", DateTimeUtils.toDisplayDate(value));
  }

  const onToDateChange = (date: Date, calendarDate: any) => {
    const value = DateTimeUtils.formatDefault(date);
    observer.update("toDate", DateTimeUtils.toDisplayDate(value));
  }

  return (
    <div className="flex-v flex-grow-0 p-3 scroll-v">

      <Input
        name="name" label={<Label text={`${t("Tên Sự Kiện")} *`}/>}
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
            defaultValue={observer.getBean().fromTime}
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
            defaultValue={observer.getBean().toTime}
          />
        </div>
      </Grid>
      <Input.TextArea
        size="medium" name="note" label={<Label text={t("Ghi Chú")}/>}
        value={observer.getBean().note} 
        onChange={(e) => observer.update("note", e.target.value)}
      />

      <Text.Title> {t("Hành Động")} </Text.Title>
      <div className="flex-h">
        <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave}>
          {t("save")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Trash/>} onClick={() => setDeleteWarning(true)}>
          {t("delete")}
        </Button>
      </div>

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

    </div>
  )
}