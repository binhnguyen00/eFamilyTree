import React from "react";
import { t } from "i18next";
import { Tabs } from "zmp-ui";

import { CalendarUtils } from "utils/CalendarUtils";
import { StyleUtils } from "utils";
import { Divider, Header, MonthCalendar, ScrollableDiv, WeekCalendar } from "components";

import datas from "./sample/events.json";

export default function UIDummyCalendar() {
  return (
    <div className="container-padding text-base">
      <Header title={t("calendar")}/>

      <Tabs defaultActiveKey="clan-events">

        <Tabs.Tab key={"clan-events"} label={<p className="text-capitalize"> {t("Sự kiện")} </p>}>
          <UIWeekCalendarContainer/>
        </Tabs.Tab>
        
        <Tabs.Tab key={"lucky-day"} label={<p className="text-capitalize"> {t("Lịch Vạn Niên")} </p>}>
          <UIMonthCalendarContainer/>
        </Tabs.Tab>

      </Tabs>
    </div>
  )
};

function UIWeekCalendarContainer() {
  const [ events, setEvents ] = React.useState<any[]>(datas);
  const [ daysWithEvent, setDaysWithEvent ] = React.useState<Date[]>([]);

  const onSelectDay = (selectedDay: string) => {
    selectedDay = selectedDay.substring(0, 10);
    const filtered: any[] = [];
    datas.map((event) => {
      if (event.date_begin.substring(0, 10) === selectedDay) {
        filtered.push(event);
      }
    })
    setEvents(filtered);
  }

  const onCurrentDay = (day: string) => {
    day = day.substring(0, 10);
    const filtered: any[] = [];
    datas.map((event) => {
      if (event.date_begin.substring(0, 10) === day) {
        filtered.push(event);
      }
    })
    setEvents(filtered);
  }

  const ClanEvents = () => {
    const html = events.map((event, index) => {
      return (
        <div key={index}>
          {event.name}
        </div>
      )
    }) as React.ReactNode[];
    return (
      <React.Fragment>
        {html}
      </React.Fragment>
    )
  }

  React.useEffect(() => {
    const now  = new Date();
    const days: Date[] = CalendarUtils.getDaysInWeekWithEvent(events, now);
    setDaysWithEvent(days)
  }, [])

  const scrollDivHeight = StyleUtils.calComponentRemainingHeight(157 + 44 + 20);
  return (
    <div className="flex-v">
      <WeekCalendar
        onSelectDay={onSelectDay}
        onCurrentDay={onCurrentDay}
        daysWithEvent={daysWithEvent}
      />
      <Divider/>
      <ScrollableDiv className="rounded-top bg-white p-2" direction="vertical" height={scrollDivHeight}>
        <ClanEvents/>
      </ScrollableDiv>
    </div>
  )
}

function UIMonthCalendarContainer() {
  return (
    <>
      <MonthCalendar/>
    </>
  )
}