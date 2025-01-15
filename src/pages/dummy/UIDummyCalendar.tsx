import React from "react";
import { t } from "i18next";
import { Grid, Stack, Tabs, Text } from "zmp-ui";

import { CalendarUtils } from "utils/CalendarUtils";
import { DateTimeUtils, StyleUtils } from "utils";
import { Card, Divider, Header, MonthCalendar, ScrollableDiv, SlidingPanel, SlidingPanelOrient, WeekCalendar } from "components";

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

  const [ selectedEvent, setSelectedEvent ] = React.useState<any>();
  const ClanEvents = () => {
    const html: React.ReactNode[] = events.map((event, idx) => {
      return (
        <div className="flex-h justify-between border-bottom align-center" onClick={() => setSelectedEvent(event)}>
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
          <EventDetails event={selectedEvent}/>
        </SlidingPanel>
      </>
    )
  }

  const EventDetails = ({ event }: { event: any }) => {
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