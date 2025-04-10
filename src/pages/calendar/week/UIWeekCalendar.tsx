import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { CalendarApi, FamilyTreeApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { CalendarUtils, DateTimeUtils, StyleUtils } from "utils";
import { CommonIcon, ScrollableDiv, WeekCalendar } from "components";

import { ServerResponse } from "types/server";
import { UIEventList } from "./UIEventList";
import { UICreate } from "./UICreate";
import { useGetActiveMembers } from "pages/family-tree/UIFamilyTree";

// import events from "../../dummy/sample/events.json"

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
        setEvents(events);
      } else {
        setDaysWithEvent([]);
        setEvents([])
      }
    };

    CalendarApi.getClanEventInWeek(userId, clanId, firstDayOfWeek, lastDayOfWeek, success);
  }, [ navigateDay ]);

  return { events, setEvents, daysWithEvent, setDaysWithEvent };
}

export function UIWeekCalendar() {
  const { userInfo } = useAppContext();
  const { goTo } = useRouteNavigate();
  const [ navigateDay, setNavigateDay ] = React.useState<Date>(new Date());
  const [ create, setCreate ] = React.useState<boolean>(false);
  const [ selectedDate, setSelectedDate ] = React.useState<string>("");

  const { activeMembers } = useGetActiveMembers(userInfo.id, userInfo.clanId);
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

  const onReload = () => {
    const date = DateTimeUtils.toDate(selectedDate);
    if (date) {
      setNavigateDay(date);
      getEventsByDay(selectedDate);
    }
  };

  const goToMonthCalendar = () => {
    goTo({ path: "calendar/month" })
  }

  return (
    <>
      <div className="flex-v">
        <WeekCalendar 
          onSelectDay={onSelectDay}
          onCurrentDay={onCurrentDay}
          onNavigateWeek={onNavigate}
          onNavigateMonth={onNavigate}
          daysWithEvent={daysWithEvent}
        />
        <ScrollableDiv 
          direction="vertical"
          height={StyleUtils.calComponentRemainingHeight(210)}
        >
          <div className="flex-v align-end" style={{ position: "absolute", bottom: 20, right: 10 }}>
            <div>
              <Button size="small" prefixIcon={<CommonIcon.AddEvent/>} onClick={() => setCreate(true)}>
                {t("add")}
              </Button>
            </div>
            <div>
              <Button size="small" onClick={goToMonthCalendar} prefixIcon={<CommonIcon.Gallery/>}>
                {t("lịch vạn niên")}
              </Button>
            </div>
          </div>

          <UIEventList 
            activeMembers={activeMembers}
            events={events}
            onReloadParent={onReload}
          />
          
          <br/> <br/> <br/>
        </ScrollableDiv>
      </div>

      <Sheet
        visible={create}
        height={StyleUtils.calComponentRemainingHeight(50)}
        title={t("Tạo Sự Kiện")}
        onClose={() => setCreate(false)}
      > 
        <UICreate
          activeMembers={activeMembers}
          selectedDate={selectedDate}
          onClose={() => setCreate(false)}
          onReloadParent={onReload}
        />
      </Sheet>
    </>
  )
}