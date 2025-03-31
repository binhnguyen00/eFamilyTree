import React from "react";
import { Calendar, OnArgs } from "react-calendar";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

import { useAppContext } from "hooks";
import { DateTimeUtils } from "utils";

import 'react-calendar/dist/Calendar.css';
import '../css/month-calendar.css';
import { t } from "i18next";

interface MonthCalendarProps {
  className?: string;
}

export default function MonthCalendar(props: MonthCalendarProps) {
  const { className } = props;
  const { settings } = useAppContext();
  
  const onActiveStartDateChange = ({ action, activeStartDate, value, view }: OnArgs) => {
    console.log("trigger when select next/prev");
  }

  const onClickDay = (selectedDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("trigger when select day", selectedDate);
  }

  const onChange = (selectedDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("trigger when change day", selectedDate);
  }

  const tileContent = ({date, view}: { date: Date, view: string }) => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    const lunar = solar.toLunarDate();

    return (
      <div>
        <p> {lunar.get().day} </p>
        <p > {lunar.getDayName()} </p>
      </div>
    );
  }

  const navigationLabel = ({ date, label, locale, view, }: any) => {
    return label;
  }

  return (
    <Calendar
      className={`${className && className}`.trim()}
      navigationLabel={navigationLabel}
      view="month"
      locale={settings.language}
      defaultValue={new Date()}
      onActiveStartDateChange={onActiveStartDateChange}
      onClickDay={onClickDay}
      onChange={onChange}
      nextLabel={t("tiếp")}
      prevLabel={t("trước")}
      tileContent={tileContent}
      selectRange={false}
      returnValue="start"
      onClickYear={() => {
        console.log("trigger when select year");
      }}
    />
  )
}