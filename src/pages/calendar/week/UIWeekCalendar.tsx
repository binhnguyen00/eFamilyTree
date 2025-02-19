import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { CalendarApi, FamilyTreeApi } from "api";
import { useAppContext } from "hooks";
import { CalendarUtils, DateTimeUtils, StyleUtils } from "utils";
import { CommonIcon, Divider, ScrollableDiv, WeekCalendar } from "components";

import { ServerResponse } from "types/server";
import { UIEventList } from "./UIEventList";
import { UICreate } from "./UICreate";

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

function useGetActiveMembers(userId: number, clanId: number) {
  const [ activeMembers, setActiveMembers ] = React.useState<{ value: number, label: string }[]>([]);

  React.useEffect(() => {
    FamilyTreeApi.getActiveMemberIds({
      userId: userId,
      clanId: clanId,
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const data: any[] = result.data;
          const members = data.map((member, idx) => {
            return { value: member.id, label: member.name }
          })
          setActiveMembers(members);
        }
      }
    })
  }, [ userId, clanId ])

  const memoizedActiveMembers = React.useMemo(() => activeMembers, [activeMembers]);

  return { activeMembers: memoizedActiveMembers };
}

export function UIWeekCalendar() {
  const { userInfo } = useAppContext();
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
    setNavigateDay(DateTimeUtils.toDate(selectedDate));
    getEventsByDay(selectedDate);
  };

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
        <UICreate
          activeMembers={activeMembers}
          selectedDate={selectedDate}
          onClose={() => setCreate(false)}
          onReloadParent={onReload}
        />
      </Sheet>

      <ScrollableDiv 
        className="rounded-top bg-white" 
        direction="vertical" 
        height={StyleUtils.calComponentRemainingHeight(157 + 44)}
      >
        <div style={{ position: "absolute", bottom: 40, right: 10 }}>
          <Button size="small" prefixIcon={<CommonIcon.AddEvent/>} onClick={() => setCreate(true)}>
            {t("add")}
          </Button>
        </div>
        <UIEventList 
          activeMembers={activeMembers}
          events={events}
          onReloadParent={onReload}
        />
        <br/> <br/> <br/>
      </ScrollableDiv>

    </div>
  )
}