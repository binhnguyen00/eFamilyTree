import React from "react";
import { t } from "i18next";
import { Button, DatePicker, Grid, Input } from "zmp-ui";

import { DateTimeUtils } from "utils";
import { CalendarApi, FamilyTreeApi } from "api";
import { CommonIcon, Label, Selection } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";

import { ServerResponse } from "types/server";

interface UICreateProps {
  selectedDate: string;
  onClose: () => void;
  onReloadParent?: () => void;
}

export interface ClanEvent {
  name: string;
  note: string;
  fromDate: string;
  fromTime?: string;
  toDate: string;
  toTime?: string;
  place: string;
  picId?: number;
  picName?: string;
}

export function UICreate(props: UICreateProps) {
  const { selectedDate, onClose, onReloadParent } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, successToast } = useNotification();
  const observer = useBeanObserver({
    fromTime: "08:00:00",
    toTime: "09:00:00"
  } as ClanEvent);
  
  const [ ids, setIds ] = React.useState<any[]>([]);
  const [ current, setCurrent ] = React.useState<Date>();

  React.useEffect(() => {
    FamilyTreeApi.getActiveMemberIds({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const data: any[] = result.data;
          setIds(data);
        }
      }
    })
  }, [])

  React.useEffect(() => {
    if (selectedDate !== "") setCurrent(DateTimeUtils.toDate(selectedDate));
    observer.update("fromDate", `${DateTimeUtils.toDisplayDate(selectedDate)}`)
    observer.update("toDate", `${DateTimeUtils.toDisplayDate(selectedDate)}`)
  }, [ selectedDate ])

  const onFromDateChange = (date: Date, calendarDate: any) => {
    observer.update("fromDate", DateTimeUtils.formatToDate(date));
  }

  const onToDateChange = (date: Date, calendarDate: any) => {
    observer.update("toDate", DateTimeUtils.formatToDate(date));
  }

  const onCreate = () => {
    const invalidData = !observer.getBean().fromDate || !observer.getBean().toDate
    if (invalidData) {
      dangerToast(t("Hãy nhập đủ dữ liệu"));
      return;
    }

    CalendarApi.createEvent({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      event: observer.getBean(),
      successCB: (result: ServerResponse) => {
        if (onReloadParent) onReloadParent()
        if (result.status === "success") {
          successToast(t("Tạo Thành Công"));
          onClose();
        } else {
          dangerToast(t("Tạo Thất Bại"));
          onClose();
        }
      },
      failCB: () => {
        if (onReloadParent) onReloadParent()
        dangerToast(t("Tạo Thất Bại"));
        onClose();
      }
    })
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
        options={ids} observer={observer} isSearchable 
        defaultValue={{ value: userInfo.id, label: userInfo.name }}
      />
      <Grid columnCount={2} columnSpace="0.5rem">
        <DatePicker
          mask maskClosable 
          label={`${t("Từ Ngày")} *`} title={t("Từ Ngày")}
          onChange={onFromDateChange} value={current}
        />
        <div className="flex-v">
          <label> {t("Thời Gian")} </label>
          <input 
            type="time" name="fromTime" className="py-2" style={{ fontSize: "1.3rem" }}
            onChange={(e) => {
              const time = `${e.target.value}:00`
              observer.update("fromTime", time);
            }}
            defaultValue={"08:00:00"}
          />
        </div>
      </Grid>
      <Grid columnCount={2} columnSpace="0.5rem">
        <DatePicker
          mask maskClosable
          label={`${t("Đến Ngày")} *`} title={t("Đến Ngày")}
          onChange={onToDateChange} value={current}
        />
        <div className="flex-v">
          <label> {t("Thời Gian")} </label>
          <input 
            type="time" name="toTime" className="py-2" style={{ fontSize: "1.3rem" }}
            onChange={(e) => {
              const time = `${e.target.value}:00`
              observer.update("toTime", time);
            }}
            defaultValue={"09:00:00"}
          />
        </div>
      </Grid>
      <Input.TextArea
        size="medium" name="note" label={<Label text={t("Ghi Chú")}/>}
        value={observer.getBean().note} 
        onChange={(e) => observer.update("note", e.target.value)}
      />
      <div>
        <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onCreate}>
          {t("save")}
        </Button>
      </div>
    </div>
  )
}