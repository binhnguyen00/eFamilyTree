import React from "react";
import { t } from "i18next";
import { Box, Button, DatePicker, Grid, Input, Sheet } from "zmp-ui";

import { CalendarApi, FamilyTreeApi } from "api";
import { useAppContext, useBeanObserver } from "hooks";
import { CalendarUtils, DateTimeUtils, StyleUtils } from "utils";
import { CommonIcon, Label, ScrollableDiv, Selection, WeekCalendar } from "components";

import { ServerResponse } from "types/server";
import { UIEvents } from "./UIEvents";

function useWeekEvents(userId: number, clanId: number, navigateDay: Date) {
  const [ events, setEvents ] = React.useState<any[]>([]);
  const [ daysWithEvent, setDaysWithEvent ] = React.useState<Date[]>([]);

  React.useEffect(() => {
    const now = DateTimeUtils.setToMidnight(navigateDay);
    const firstDayOfWeek = DateTimeUtils.formatDefault(CalendarUtils.firstDayOfWeek(now));
    const lastDayOfWeek = DateTimeUtils.formatDefault(CalendarUtils.lastDayOfWeek(now));

    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const events: any[] = result.data;
        const days: Date[] = CalendarUtils.getDaysInWeekWithEvent(events, DateTimeUtils.setToMidnight(navigateDay));
        setDaysWithEvent(days);
      } else {
        setDaysWithEvent([]);
      }
    };

    CalendarApi.getClanEventInWeek(userId, clanId, firstDayOfWeek, lastDayOfWeek, success);
  }, [ navigateDay ]);

  return { 
    events, setEvents,
    daysWithEvent, setDaysWithEvent
  };
}

export function UIWeekCalendar() {
  const { userInfo } = useAppContext();
  const [ navigateDay, setNavigateDay ] = React.useState<Date>(new Date());
  const [ create, setCreate ] = React.useState<boolean>(false);
  const [ selectedDate, setSelectedDate ] = React.useState<string>("");

  const { events, setEvents, daysWithEvent } = useWeekEvents(userInfo.id, userInfo.clanId, navigateDay);

  const getEventsByDay = (day: string) => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const data: any[] = result.data;
        setEvents(data);
      } else setEvents([]);
    }
    CalendarApi.getClanEventInDate(userInfo.id, userInfo.clanId, day, success);
  }

  const onSelectDay = (selectedDay: string) => {
    console.log(selectedDay);
    setSelectedDate(selectedDay)
    getEventsByDay(selectedDay);
  }

  const onCurrentDay = (day: string) => {
    setSelectedDate(day);
    getEventsByDay(day);
  }

  const onNavigate = (day: Date) => {
    setNavigateDay(day);
  }

  const scrollDivHeight = StyleUtils.calComponentRemainingHeight(157 + 44 + 20);
  return (
    <div className="flex-v">
      <WeekCalendar 
        onSelectDay={onSelectDay}
        onCurrentDay={onCurrentDay}
        onNavigateWeek={onNavigate}
        onNavigateMonth={onNavigate}
        daysWithEvent={daysWithEvent}
      />

      <Sheet
        visible={create}
        height={StyleUtils.calComponentRemainingHeight(0)}
        title={t("Tạo Sự Kiện")}
        onClose={() => setCreate(false)}
      > 
        <UICreate selectedDate={selectedDate}/>
      </Sheet>

      <ScrollableDiv className="rounded-top bg-white" direction="vertical" height={scrollDivHeight}>
        {/* <div className="scroll-h p-2" style={{ position: "absolute", bottom: 5, right: 0 }}>
          <Button size="small" variant="secondary" prefixIcon={<CommonIcon.Plus/>} onClick={() => setCreate(true)}>
            {t("create")}
          </Button>
        </div> */}
        <UIEvents events={events}/>
        <br/> <br/>
      </ScrollableDiv>
    </div>
  )
}

interface UICreateProps {
  selectedDate: string;
}
type CreateEvent = {
  name: string;
  note: string;
  fromDate: string;
  toDate: string;
  place: string;
  picId?: number;
  picName?: string;
}
export function UICreate(props: UICreateProps) {
  const { selectedDate } = props;
  const { userInfo } = useAppContext();
  
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
  }, [ selectedDate ])

  const observer = useBeanObserver({

  } as CreateEvent);

  const onFromDateChange = (date: Date, calendarDate: any) => {
    observer.update("fromDate", DateTimeUtils.formatDefault(date));
  }

  const onToDateChange = (date: Date, calendarDate: any) => {
    console.log(date);
    console.log(calendarDate);
  }

  const onCreate = () => {

  }

  return (
    <div className="flex-v flex-grow-0 p-3">
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
          label={t("Từ Ngày")} title={t("Từ Ngày")}
          onChange={onFromDateChange} value={current}
        />
        <Input
          name="fromDate" label={t("Giờ")}
        />
      </Grid>
      <Grid columnCount={2} columnSpace="0.5rem">
        <DatePicker
          mask maskClosable
          label={t("Đến Ngày")} title={t("Đến Ngày")}
          onChange={onToDateChange} value={current}
        />
        <Input
          name="fromDate" label={t("Giờ")}
        />
      </Grid>
      <Input.TextArea
        size="medium" name="note" label={<Label text={t("Ghi Chú")}/>}
        value={observer.getBean().note} 
        onChange={(e) => observer.update("note", e.target.value)}
      />
      <div>
        <Button size="small" prefixIcon={<CommonIcon.Plus/>} onClick={onCreate}>
          {t("create")}
        </Button>
      </div>
    </div>
  )
}