import React from "react";

import {
  format,
  getWeek,
  addWeeks,
  subWeeks,
  subMonths,
  addMonths
} from "date-fns";
import { vi, enUS } from 'date-fns/locale'

import Cells from "./Cells";
import DaysInWeek from "./Day";

import "../css/week-calendar.css"
import { useAppContext } from "hooks";

interface WeekCalendarProps {
  onSelectDay?: (date: Date) => void
}
export default function WeekCalendar(props: WeekCalendarProps) {
  const { settings } = useAppContext();
  const { onSelectDay } = props;

  const [ currentMonth, setCurrentMonth ] = React.useState(new Date());
  const [ currentWeek, setCurrentWeek ] = React.useState(getWeek(currentMonth));
  const [ selectedDate, setSelectedDate ] = React.useState(new Date());

  const navigateMonth = (type: "prev" | "next") => {
    if (type === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (type === "next") {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const navigateWeek = (type: "prev" | "next") => {
    if (type === "prev") {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (type === "next") {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onSelectCell = (day: Date, dayStr: string) => {
    setSelectedDate(day);
    // onSelectDay(dayStr);
  }

  return (
    <div className="calendar">
      <Header 
        navigateMonth={navigateMonth}
        currentMonth={currentMonth}
      />
      <DaysInWeek currentMonth={currentMonth}/>
      <Cells 
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        onSelectCell={onSelectCell}
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
}
function Header(props: HeaderProps) {
  const { currentMonth, navigateMonth } = props;
  const dateFormat = "MMM yyyy";

  let month: number = currentMonth.getMonth() + 1;

  let prevMonth: number = 1;
  if (month === 1 && currentMonth.getMonth() + 1 === 1) prevMonth = 12; 
  else prevMonth = month - 1;

  let nextMonth: number = month + 1;
  if (nextMonth === 13 && month === 12) nextMonth = 1;

  return (
    <div className="flex-h justify-between">
      <div onClick={() => navigateMonth?.("prev")}>
        {`< Tháng ${prevMonth}`}
      </div>
      <span>
        {format(currentMonth, dateFormat, { locale: vi })}
      </span>
      <div onClick={() => navigateMonth?.("next")}>
        {`Tháng ${nextMonth} >`}
      </div>
    </div>
  );
}

// ==========================================
// Footer
// ==========================================
interface FooterProps {
  currentWeek: any;
  navigateWeek: (buttonType: "prev" | "next") => void;
}
function Footer(props: FooterProps) {
  const { currentWeek, navigateWeek } = props;

  return (
    <div className="flex-h justify-between">
      <div onClick={() => navigateWeek("prev")}> 
        {"< Trước"}
      </div>
      <div>{currentWeek}</div>
      <div onClick={() => navigateWeek("next")}>
        {"Sau >"}
      </div>
    </div>
  );
}