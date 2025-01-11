import React from "react";
import { t } from "i18next";
import { vi, enUS } from 'date-fns/locale'
import { format, getWeek, addWeeks, subWeeks, subMonths, addMonths } from "date-fns";

import { Cells } from "./Cells";
import { DaysInWeek } from "./Day";
import { useAppContext } from "hooks";

import "../css/week-calendar.css"
import { CommonIcon } from "components/icon";

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
        currentMonth={currentMonth}
        navigateMonth={navigateMonth}
        navigateCurrentMonth={() => setCurrentMonth(new Date())}
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