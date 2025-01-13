import React from "react";
import { t } from "i18next";
import { Grid, Tabs } from "zmp-ui";

import { CalendarApi } from "api";
import { useAppContext } from "hooks";
import { ServerResponse } from "server";
import { CalendarUtils, DateTimeUtils, StyleUtils } from "utils";
import { Card, Header, MonthCalendar, ScrollableDiv, WeekCalendar } from "components";

export function UICalendar() {
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
}

function UIWeekCalendarContainer() {
  const { userInfo } = useAppContext();
  const [ events, setEvents ] = React.useState<any[]>([]);
  const [ daysWithEvent, setDaysWithEvent ] = React.useState<Date[]>([]);

  const getEventsByDay = (day: string) => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const data: any[] = result.data;
        setEvents(data);
      } else setEvents([]);
    }
    CalendarApi.getClanEventsByDate(userInfo.id, userInfo.clanId, day, success);
  }

  const onSelectDay = (selectedDay: string) => {
    getEventsByDay(selectedDay);
  }

  const onCurrentDay = (day: string) => {
    getEventsByDay(day);
  }

  const ClanEvents = () => {
    const html = events.map((event, idx) => {
      return (
        <Card
          key={idx} title={event.name}          
          content={
            <div key={idx} className="rounded flex-v">
              {event["date_begin"] && <small> {`${t("from")}: ${DateTimeUtils.toDisplayDate(event["date_begin"])}`} </small>}
              {event["date_end"] && <small> {`${t("to")}: ${DateTimeUtils.toDisplayDate(event["date_end"])}`} </small>}
              {event["place"] && <small> {`${t("place")}: ${event["place"]}`} </small>}
              {event["note"] && <small> {`${t("note")}: ${event["note"]}`} </small>}
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

  React.useEffect(() => {
    // Get all days events from this week
    const now  = new Date();
    const firstDayOfWeek = DateTimeUtils.formatDefault(CalendarUtils.firstDayOfWeek(now));
    const lastDayOfWeek = DateTimeUtils.formatDefault(CalendarUtils.lastDayOfWeek(now));
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const events: any[] = result.data;
        const days: Date[] = CalendarUtils.getDaysInWeekWithEvent(events, now);
        setDaysWithEvent(days);
      } else setDaysWithEvent([]);
    }
    CalendarApi.getClanEventInWeek(userInfo.id, userInfo.clanId, firstDayOfWeek, lastDayOfWeek, success);
  }, [])

  const scrollDivHeight = StyleUtils.calComponentRemainingHeight(157 + 44 + 20);
  return (
    <div className="flex-v">
      <WeekCalendar 
        onSelectDay={onSelectDay}
        onCurrentDay={onCurrentDay}
        daysWithEvent={daysWithEvent}
      />
      <ScrollableDiv direction="vertical" height={scrollDivHeight}>
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