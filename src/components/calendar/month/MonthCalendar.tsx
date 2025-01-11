import React from "react";
import { t } from "i18next";
import { Calendar, OnArgs } from "react-calendar";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

import { useAppContext } from "hooks";
import { DateTimeUtils } from "utils";

import 'react-calendar/dist/Calendar.css';
import '../css/month-calendar.css';

export default function MonthCalendar() {
  const { settings } = useAppContext();
  
  const onActiveStartDateChange = ({ action, activeStartDate, value, view }: OnArgs) => {
    console.log("trigger when select next/prev");
  }

  const onClickDay = (selectedDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("trigger when select day");
    console.log(selectedDate);
  }

  const onChange = (selectedDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("trigger when change day");
    console.log(selectedDate);
  }

  const tileContent = ({date, view}: { date: Date, view: string }) => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    const lunar = solar.toLunarDate();

    return (
      <small>
        <p> {lunar.get().day} </p>
        <p> {lunar.getDayName()} </p>
      </small>
    );
  }

  const navigationLabel = ({ date, label, locale, view, }: any) => {
    return label;
  }

  return (
    <Calendar
      className={"text-base"}
      navigationLabel={navigationLabel}
      view="month"
      locale={settings.language}
      defaultValue={new Date()}
      onActiveStartDateChange={onActiveStartDateChange}
      onClickDay={onClickDay}
      onChange={onChange}
      nextLabel="Tiếp"
      prevLabel="Trước"
      tileContent={tileContent}
      selectRange={false}
      returnValue="start"
    />
  )
}