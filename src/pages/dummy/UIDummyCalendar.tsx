import React from "react";
import { t } from "i18next";
import { Grid, Tabs } from "zmp-ui";

import { CalendarUtils } from "utils/CalendarUtils";
import { DateTimeUtils, StyleUtils } from "utils";
import { Card, Divider, Header, MonthCalendar, ScrollableDiv, WeekCalendar } from "components";

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
  const [ navigateDay, setNavigateDay ] = React.useState<Date>(new Date());

  const onSelectDay = (selectedDay: string) => {
    selectedDay = selectedDay.substring(0, 10);
    const filtered: any[] = [];
    datas.map((event) => {
      if (event.from_date.substring(0, 10) === selectedDay) {
        filtered.push(event);
      }
    })
    setEvents(filtered);
  }

  const onCurrentDay = (day: string) => {
    day = day.substring(0, 10);
    const filtered: any[] = [];
    datas.map((event) => {
      if (event.from_date.substring(0, 10) === day) {
        filtered.push(event);
      }
    })
    setEvents(filtered);
  }

  const ClanEvents = () => {
    const html: React.ReactNode[] = events.map((event, idx) => {
      return (
        <Card
          key={idx} title={event.name}          
          content={
            <div key={idx} className="rounded flex-v">
              {event["date_begin"] && <small> {`${t("from")}: ${DateTimeUtils.toDisplayDate(event["date_begin"])}`} </small>}
              {event["date_end"] && <small> {`${t("to")}: ${DateTimeUtils.toDisplayDate(event["date_end"])}`} </small>}
              {event["place"] && <small> {`${t("place")}: ${event["place"]}`} </small>}
              {event["note"] && <small> {event["note"]} </small>}
            </div>
          }
        />
      )
    }) as React.ReactNode[];
    return (
      <Grid 
        className="p-2"
        rowSpace="0.5rem" 
        columnSpace="0.5rem" 
        columnCount={html.length > 2 ? 2 : 1} 
      >
        {html.length ? (
          <> {html} </>
        ): (
          <span className="center"> {t("no_calendar_events")} </span>
        )}
      </Grid>
    )
  }

  const onNavigate = (day: Date) => {
    console.log(day);
    setNavigateDay(day);
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
        onNavigateMonth={onNavigate}
        onNavigateWeek={onNavigate}
      />
      <Divider/>
      <ScrollableDiv className="rounded-top bg-white" direction="vertical" height={scrollDivHeight}>
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