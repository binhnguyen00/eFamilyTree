import React from "react";
import { t } from "i18next";
import { Grid } from "zmp-ui";

import { CalendarApi } from "api";
import { useAppContext } from "hooks";
import { CalendarUtils, DateTimeUtils, StyleUtils } from "utils";
import { Card, Divider, ScrollableDiv, WeekCalendar } from "components";

import { ServerResponse } from "types/server";

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

  const { events, setEvents, daysWithEvent } = useWeekEvents(userInfo.id, userInfo.clanId, navigateDay);

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

      <Divider/>

      <ScrollableDiv className="rounded-top bg-white" direction="vertical" height={scrollDivHeight}>
        <UIEvents events={events}/>
      </ScrollableDiv>
    </div>
  )
}

interface UIEventsProps {
  events: any[];
}
function UIEvents(props: UIEventsProps) { 
  const { events } = props;
  const html = events.map((event, idx) => {
    return (
      <Card
        key={idx} title={event.name}          
        content={
          <div key={idx} className="rounded flex-v">
            {event["from_date"] && <small> {`${t("from")}: ${DateTimeUtils.toDisplayDate(event["from_date"])}`} </small>}
            {event["to_date"] && <small> {`${t("to")}: ${DateTimeUtils.toDisplayDate(event["to_date"])}`} </small>}
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