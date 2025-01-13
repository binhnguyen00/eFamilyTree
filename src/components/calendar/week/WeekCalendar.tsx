import React from "react";
import { t } from "i18next";
import { vi, enUS } from 'date-fns/locale'
import { format, getWeek, addWeeks, subWeeks, subMonths, addMonths } from "date-fns";

import { Cells } from "./Cells";
import { DaysInWeek } from "./Day";

import { useAppContext } from "hooks";
import { CommonIcon } from "components";
import { DateTimeUtils } from "utils";

import "../css/calendar.css";
import "../css/week-calendar.css";

interface WeekCalendarProps {
  onCurrentDay?: (formattedDay: string) => void;
  onSelectDay?: (formattedDay: string) => void;
  daysWithEvent?: Date[];
}
export default function WeekCalendar(props: WeekCalendarProps) {
  const { onSelectDay, onCurrentDay, daysWithEvent } = props;

  const [ now, setNow ] = React.useState<Date>(new Date());
  const [ currentWeek, setCurrentWeek ] = React.useState(getWeek(now));
  const [ selectedDate, setSelectedDate ] = React.useState(new Date());

  React.useEffect(() => {
    if (onCurrentDay) {
      onCurrentDay(DateTimeUtils.formatDefault(now));
    }
  }, [])

  const navigateMonth = (type: "prev" | "next") => {
    if (type === "prev") {
      setNow(subMonths(now, 1));
    }
    if (type === "next") {
      setNow(addMonths(now, 1));
    }
  };

  const navigateWeek = (type: "prev" | "next") => {
    if (type === "prev") {
      setNow(subWeeks(now, 1));
      setCurrentWeek(getWeek(subWeeks(now, 1)));
    }
    if (type === "next") {
      setNow(addWeeks(now, 1));
      setCurrentWeek(getWeek(addWeeks(now, 1)));
    }
  };

  const onSelectCell = (day: Date, dayStr: string) => {
    setSelectedDate(day);
    if (onSelectDay) onSelectDay(dayStr);
  }

  return (
    <div className="calendar rounded">
      <Header 
        currentMonth={now}
        navigateMonth={navigateMonth}
        navigateCurrentMonth={() => setNow(new Date())}
      />
      <DaysInWeek currentMonth={now}/>
      <Cells 
        selectedDate={selectedDate}
        currentDay={now}
        onSelectCell={onSelectCell}
        daysWithEvents={daysWithEvent}
      />
      <Footer 
        currentWeek={currentWeek}
        navigateWeek={navigateWeek}
      /> 
    </div>
  )
}

// ==========================================
// Header
// ==========================================
interface HeaderProps {
  currentMonth: Date;
  onClick?: () => void;
  navigateMonth?: (type: "prev" | "next") => void;
  navigateCurrentMonth?: () => void;
}
function Header(props: HeaderProps) {
  const { settings } = useAppContext();
  const { currentMonth, navigateMonth, navigateCurrentMonth } = props;
  const dateFormat = "MMM yyyy";

  const month: number = currentMonth.getMonth() + 1;

  let prevMonth: number = 1;
  if (month === 1 && currentMonth.getMonth() + 1 === 1) prevMonth = 12; 
  else prevMonth = month - 1;

  let nextMonth: number = month + 1;
  if (nextMonth === 13 && month === 12) nextMonth = 1;

  const HeaderButton = ({ func }: { func: "prev" | "next" }) => {
    const label = `${t("month")} ${func === "prev" ? prevMonth : nextMonth}`
    return (
      <div className="flex-h button" onClick={() => navigateMonth?.(func)}>
        {func === "prev" && <CommonIcon.ChevonLeft size={20}/>}
        {label}
        {func === "next" && <CommonIcon.ChevonRight size={20}/>}
      </div>
    )
  }

  const HeaderTitle = () => {
    const title = format(currentMonth, dateFormat, { locale: settings.language === "vi" ? vi : enUS })
    return (
      <span 
        className="button text-capitalize"
        onClick={navigateCurrentMonth}
      >
        {title}
      </span>
    )
  }

  return (
    <div className="flex-h justify-between pb-2 pt-1">
      <HeaderButton func="prev"/>
      <HeaderTitle/>
      <HeaderButton func="next"/>
    </div>
  );
}

// ==========================================
// Footer
// ==========================================
interface FooterProps {
  currentWeek: any;
  navigateWeek?: (buttonType: "prev" | "next") => void;
}
function Footer(props: FooterProps) {
  const { currentWeek, navigateWeek } = props;

  const FooterButton = ({ func }: { func: "prev" | "next" }) => {
    return (
      <div className="flex-h button" onClick={() => navigateWeek?.(func)}>
        {func === "prev" && <CommonIcon.ChevonLeft size={20}/>}
        {`${t("week")} ${func === "prev" ? currentWeek - 1 : currentWeek + 1}`}
        {func === "next" && <CommonIcon.ChevonRight size={20}/>}
      </div>
    )
  }

  const FooterTitle = () => {
    return (
      <span className="text-capitalize">
        {`${t("week")} ${currentWeek}`}
      </span>
    )
  }

  return (
    <div className="flex-h justify-between p-1">
      <FooterButton func="prev"/>
      <FooterTitle/>
      <FooterButton func="next"/>
    </div>
  );
}