import React from "react";

import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
  subMonths,
  addMonths
} from "date-fns";
import { vi } from 'date-fns/locale/vi'

import "./css/week-calendar.css"

interface WeekCalendarProps {
  onSelectDay?: (date: Date) => void
}
export default function WeekCalendar(props: WeekCalendarProps) {
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
  const dateFormat = "MM yyyy";

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
// Day / Thứ Ngày
// ==========================================
interface DaysInWeekProps {
  currentMonth: any;
}
function DaysInWeek(props: DaysInWeekProps) {
  const { currentMonth } = props;

  const dateFormat = "EEE";
  const days: React.ReactNode[] = [];

  let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="col col-center" key={i}>
        {format(addDays(startDate, i), dateFormat, { locale: vi })}
      </div>
    );
  }
  return (
    <div className="flex-h">
      {days}
    </div>
  );
}

// ==========================================
// Cells
// ==========================================
interface CellsProps {
  currentMonth: any;
  selectedDate: Date;
  onSelectCell: (day: Date, dayStr: string) => void;
}
function Cells(props: CellsProps) {
  const { currentMonth, selectedDate, onSelectCell } = props;

  const dateFormat = "d";
  const startDate: Date = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const endDate: Date = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });

  let rows: React.ReactNode[]  = [];
  let days: React.ReactNode[] = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      days.push(
        <div
          className={`col cell ${
            isSameDay(day, new Date())
              ? "today"
              : isSameDay(day, selectedDate)
              ? "selected"
              : ""
          }`}
          key={day.toISOString()}
          onClick={() => {
            const dayStr = format(cloneDay, "ccc dd MMM yy");
            onSelectCell(cloneDay, dayStr);
          }}
        >
          <span className="number">{formattedDate}</span>
          <span className="bg">{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }

    rows.push(
      <div className="row" key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }

  return <div className="body">{rows}</div>;
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