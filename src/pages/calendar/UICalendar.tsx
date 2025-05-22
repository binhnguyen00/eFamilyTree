import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";
import { Calendar, OnArgs } from "react-calendar";
import { SolarDate } from "@nghiavuive/lunar_date_vi";
import 'react-calendar/dist/Calendar.css';

import { CalendarApi } from "api";
import { DateTimeUtils, DivUtils } from "utils";
import { ServerResponse, Event, CalendarView } from "types";
import { Divider, Header, Loading, Retry, ScrollableDiv } from "components";
import { useAppContext, usePageContext } from "hooks";

import { UIEvents } from "./UIEvents";

function useCalendar(date: Date) {
  const { userInfo }            = useAppContext();
  const [ events, setEvents ]   = React.useState<Event[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ]     = React.useState(false);
  const [ reload, setReload ]   = React.useState(false);

  const refresh = () => setReload(!reload);
  const formated = DateTimeUtils.formatToDate(date); // DD/MM/YYYY

  const convert = (raws: any[]): Event[] => {
    if (!raws.length) return [];
    return raws.map(raw => ({
      id        : raw.id,
      name      : raw.name,
      note      : raw.note,
      pic       : raw.pic,
      picId     : raw.pic_id,
      fromDate  : raw.from_date,
      toDate    : raw.to_date,
      place     : raw.place,
      address   : raw.address,
    } as Event))
  }

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    CalendarApi.searchEventsByMonth({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      date: formated,
      successCB: (response: ServerResponse) => {
        setLoading(false);
        if (response.status === "success") {
          const events: Event[] = convert(response.data);
          setEvents(events);
        } else {
          setError(true);
          setEvents([]);
        }
      },
      failCB: () => {
        setLoading(false);
        setError(true);
        setEvents([]);
      }
    })
  }, [ reload, date ])

  return { events, loading, error: false, refresh }
}

export function UICalendar() {
  const { settings } = useAppContext();
  const { permissions } = usePageContext();

  const [ view, setView ] = React.useState<CalendarView>(CalendarView.MONTH);
  const [ activeDate, setActiveDate ] = React.useState<Date>(new Date());
  const [ activeMonth, setActiveMonth ] = React.useState<Date>(new Date());
  const { events, loading, error, refresh } = useCalendar(activeMonth);

  const [ isTitleSticky, setIsTitleSticky ] = React.useState(false);
  const [ eventsSectionRef, setEventsSectionRef ] = React.useState<HTMLDivElement | null>(null);
  const [ loadingEvents, setLoadingEvents ] = React.useState(false);
  
  const calendarRef = React.useRef(null);

  // check if the user has scroll to the events section
  React.useEffect(() => {
    if (!eventsSectionRef) return;

    const headerHeight = 65;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleSticky(!entry.isIntersecting);
      },
      {
        threshold: 1,
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
      }
    );

    observer.observe(eventsSectionRef);
    return () => observer.disconnect();
  }, [eventsSectionRef]);

  const eventDates = React.useMemo(() => {
    const dates: Date[] = [];
    events.forEach(event => {
      try {
        const fromDate = DateTimeUtils.toDate(event.fromDate);
        const toDate = DateTimeUtils.toDate(event.toDate);
        if (!fromDate || !toDate) return;

        if (DateTimeUtils.isSameDay(fromDate, toDate)) {
          dates.push(fromDate);
          return;
        }
        let currentDate = new Date(fromDate);
        while (currentDate <= toDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (error) {
        console.error('Error parsing event dates', error);
      }
    });
    
    return dates;
  }, [ events ])
  
  const onActiveStartDateChange = ({ action, activeStartDate, value, view }: OnArgs) => {
    if (action === "drillUp") {
      setView(CalendarView.YEAR);
    } else if (action === "drillDown") {
      setView(CalendarView.MONTH);
      if (activeStartDate) setActiveMonth(activeStartDate);
    }
    if (activeStartDate) {
      if (view === CalendarView.MONTH) {
        setActiveDate(activeStartDate);
      }
    }
  }

  const onClickDay = (selectedDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveDate(selectedDate);
  }

  const tileContent = ({date, view}: { date: Date, view: string }) => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    const lunar = solar.toLunarDate();

    const isToday = DateTimeUtils.isSameDay(date, new Date());
    const hasEvent = eventDates.some(eventDate => 
      date.getDate() === eventDate.getDate() &&
      date.getMonth() === eventDate.getMonth() &&
      date.getFullYear() === eventDate.getFullYear()
    );

    return (
      <div className="relative">
        {view === CalendarView.MONTH && (
          <p style={{ fontSize: '1rem' }} className={classNames("mt-2 text-gray-600", isToday && "text-secondary")}> 
            {lunar.get().day} 
          </p>
        )}
        {view === CalendarView.YEAR && (
          <p> {lunar.getMonthName()} </p>
        )}
        {hasEvent && (
          <div className="absolute bottom-0 right-0" style={{
            height: '6px',
            width: '6px',
            backgroundColor: 'red',
            borderRadius: '50%',
            margin: '2px auto'
          }} />
        )}
      </div>
    );
  }

  const onPrevious = () => {
    let newDate: Date = activeDate;
    if (CalendarView.MONTH === view) {
      newDate = DateTimeUtils.addDays(activeDate, -1);
    } else if (CalendarView.YEAR === view) {
      newDate = DateTimeUtils.addMonths(activeDate, -1);
    }
    setActiveDate(newDate);
  }

  const onNext = () => {
    let newDate: Date = activeDate;
    if (CalendarView.MONTH === view) {
      newDate = DateTimeUtils.addDays(activeDate, 1);
    } else if (CalendarView.YEAR === view) {
      newDate = DateTimeUtils.addMonths(activeDate, 1);
    }
    setActiveDate(newDate);
  }

  const onChangeView = () => {
    if (CalendarView.MONTH === view) {
      setView(CalendarView.YEAR);
    } else if (CalendarView.YEAR === view) {
      setView(CalendarView.MONTH);
    }
  }

  const renderContainer = () => {
    const withEase = "transition-all duration-300 ease-in-out"

    const onLoading = React.useCallback((loading: boolean) => {
      setLoadingEvents(loading);
    }, []);

    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Retry title={t("Gặp sự cố!")} onClick={refresh}/>
    } else {
      return (
        <ScrollableDiv direction="vertical" height={DivUtils.calculateHeight(0)}>
          <Calendar
            ref={calendarRef}
            view={view}
            returnValue="start"
            locale={settings.language}
            value={activeDate}
            defaultValue={activeDate}
            selectRange={false}
            showNavigation={false}
            onClickDay={onClickDay}
            tileContent={tileContent}
            onActiveStartDateChange={onActiveStartDateChange}
          />
          
          {/* controller */}
          <div ref={setEventsSectionRef} className="pt-3"/>
          <div style={{ zIndex: 999 }} className={classNames("flex-h", "sticky", "top-0", isTitleSticky && "p-2", withEase)}>
            <Button 
              size="small" variant={isTitleSticky ? "secondary" : "tertiary"} loading={loadingEvents}
              className={classNames("button-link", withEase)} onClick={onPrevious}
            >
              {t("trước")}
            </Button>
            <Text 
              size={isTitleSticky ? "small" : "large"} onClick={onChangeView}
              className={classNames("center", "bold", "text-primary", "rounded", withEase, isTitleSticky && "bg-primary text-secondary")}
            >
              {renderSolarHeader(activeDate)}
            </Text>
            <Button 
              size="small" variant={isTitleSticky ? "secondary" : "tertiary"} loading={loadingEvents}
              className={classNames("button-link", withEase)} onClick={onNext}
            >
              {t("tiếp")}
            </Button>
          </div>

          <UIEvents permissions={permissions} date={activeDate} className={"pt-3"} onLoading={onLoading}/>
        </ScrollableDiv>
      )
    }
  }

  const renderSolarHeader = (date: Date) => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    if (isTitleSticky) {
      return `Ngày ${solar.get().day}, ${solar.get().month} ${solar.get().year}`;
    }
    return `Tháng ${solar.get().month} ${solar.get().year}`;
  }

  const renderLunarHeader = (date: Date): string => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    const lunar = solar.toLunarDate();
    return `ngày ${lunar.getDayName()}, tháng ${lunar.getMonthName()}, năm ${lunar.getYearName()}`;
  }

  return (
    <>
      <Header title={t("lịch vạn niên")} subtitle={renderLunarHeader(activeDate)}/>

      <div className="container bg-white text-base">
        {renderContainer()}
      </div>
    </>
  )
}