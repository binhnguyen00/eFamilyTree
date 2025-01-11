import React from "react";

import { addDays, format, startOfWeek } from "date-fns";
import { vi, enUS } from 'date-fns/locale'

interface DaysInWeekProps {
  currentMonth: any;
}

export default function DaysInWeek(props: DaysInWeekProps) {
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