import React from "react";
import { t } from "i18next";
import { Grid, Stack, Text } from "zmp-ui";

import { CalendarApi } from "api";
import { useAppContext } from "hooks";
import { CalendarUtils, DateTimeUtils, StyleUtils } from "utils";
import { Card, Divider, ScrollableDiv, SlidingPanel, SlidingPanelOrient, WeekCalendar } from "components";

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
  const { events } = props; // TODO: Sort events by from_date
  const [ selectedEvent, setSelectedEvent ] = React.useState<any>();

  const html = events.map((event, idx) => {
    return (
      <div 
        className="flex-h justify-between border-bottom align-center"
        onClick={() => setSelectedEvent(event)}
      >
        <Text size="large" className="bold button">
          {event.name}
        </Text>
        <div className="flex-v align-end">
          <small className="bold"> {DateTimeUtils.toDisplayTime(event["from_date"])} </small>
          <small> {DateTimeUtils.toDisplayTime(event["to_date"])} </small>
        </div>
      </div>
    )
  }) as React.ReactNode[];

  return (
    <>
      <Stack space="0.5rem" className="p-2">
        {html.length ? (
          <> {html} </>
        ): (
          <span className="center"> {t("no_calendar_events")} </span>
        )}
      </Stack>
      <SlidingPanel
        visible={selectedEvent ? true : false}
        className="bg-white text-base"
        close={() => setSelectedEvent(null)}
        orient={SlidingPanelOrient.BottomToTop}
        height={StyleUtils.calComponentRemainingHeight(0)}
        header={t("event_details")}
      >
        <UIEventDetails event={selectedEvent}/>
      </SlidingPanel>
    </>
  )
}

function UIEventDetails({ event }: { event: any }) {
  return (
    <div>
      <Text.Title>
        {event?.name}
      </Text.Title>
      <Divider size={0}/>

      <div>
        <p> {`
          ${t("from")} 
          ${DateTimeUtils.toDisplayTime(event?.["from_date"])}, 
          ${DateTimeUtils.toDisplayDate(event?.["from_date"])}`} </p>
        <p> {`
          ${t("to")} 
          ${DateTimeUtils.toDisplayTime(event?.["to_date"])}, 
          ${DateTimeUtils.toDisplayDate(event?.["to_date"])}
        `} </p>

        <Divider size={0}/>
        <strong> {t("place")} </strong>
        <p> {event?.["place"]} </p>

        <Divider size={0}/>
        <strong> {t("note")} </strong>
        <p> {event?.["note"]} </p>
      </div>
    </div>
  )
}