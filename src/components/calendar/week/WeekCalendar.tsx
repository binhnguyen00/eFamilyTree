import React from "react";
import { t } from "i18next";
import { vi, enUS } from 'date-fns/locale'
import { format, getWeek, addWeeks, subWeeks, subMonths, addMonths } from "date-fns";

import { Cells } from "./Cells";

import { useAppContext } from "hooks";
import { CommonIcon } from "components";
import { DateTimeUtils } from "utils";

import "../css/week-calendar.css";

interface WeekCalendarProps {
  onCurrentDay?: (formattedDay: string) => void;
  onSelectDay?: (formattedDay: string) => void;
  onNavigateMonth?: (day: Date) => void;
  onNavigateWeek?: (day: Date) => void;
  daysWithEvent?: Date[];
  className?: string;
}
export default function WeekCalendar(props: WeekCalendarProps) {
  const { onSelectDay, onCurrentDay, onNavigateWeek, onNavigateMonth, daysWithEvent, className } = props;

  const [ now, setNow ] = React.useState<Date>(new Date());
  const [ currentWeek, setCurrentWeek ] = React.useState(getWeek(now));
  const [ selectedDate, setSelectedDate ] = React.useState(new Date());

  React.useEffect(() => {
    if (onCurrentDay) {
      onCurrentDay(DateTimeUtils.formatDefault(now));
    }
  }, [])

  const navigateMonth = (type: "prev" | "next") => {
    let clone = new Date(now);
    if (type === "prev") {
      clone = subMonths(now, 1) 
      setNow(clone);
    }
    if (type === "next") {
      clone = addMonths(now, 1);
      setNow(clone);
    }
    if (onNavigateMonth) onNavigateMonth(clone);
  };

  const navigateWeek = (type: "prev" | "next") => {
    let clone = new Date(now);
    if (type === "prev") {
      clone = subWeeks(now, 1); 
      setNow(clone);
      setCurrentWeek(getWeek(subWeeks(now, 1)));
    }
    if (type === "next") {
      clone = addWeeks(now, 1) 
      setNow(clone);
      setCurrentWeek(getWeek(addWeeks(now, 1)));
    }
    if (onNavigateWeek) onNavigateWeek(clone);
  };

  const onSelectCell = (day: Date, dayStr: string) => {
    setSelectedDate(day);
    if (onSelectDay) onSelectDay(dayStr);
  }

  return (
    <div className={`${className}`.trim()}>
      <Header 
        currentMonth={now}
        navigateMonth={navigateMonth}
        navigateCurrentMonth={() => setNow(new Date())}
      />
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

  const renderButton = ({ func }: { func: "prev" | "next" }) => {
    const label = `${t("month")} ${func === "prev" ? prevMonth : nextMonth}`
    return (
      <div className="flex-h button" onClick={() => navigateMonth?.(func)}>
        {func === "prev" && <CommonIcon.ChevonLeft size={20}/>}
        {label}
        {func === "next" && <CommonIcon.ChevonRight size={20}/>}
      </div>
    )
  }

  const renderTitle = () => {
    const title = format(currentMonth, dateFormat, { locale: settings.language === "vi" ? vi : enUS })
    return (
      <span 
        className="button text-primary"
        onClick={navigateCurrentMonth}
      >
        {title}
      </span>
    )
  }

  return (
    <div className="flex-h justify-between py-2">
      {renderButton({ func: "prev" })}
      {renderTitle()}
      {renderButton({ func: "next" })}
    </div>
  );
}

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