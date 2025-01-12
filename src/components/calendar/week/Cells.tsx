import React from "react";
import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { 
  addDays, format, isSameDay, lastDayOfWeek, startOfWeek 
} from "date-fns";
import { DateTimeUtils } from "utils";

interface CellsProps {
  daysWithEvents?: any[];
  currentDay: Date;
  selectedDate: Date;
  onSelectCell: (day: Date, dayStr: string) => void;
}

export function Cells(props: CellsProps) {
  const { currentDay, selectedDate, onSelectCell, daysWithEvents } = props;

  const startDate: Date = startOfWeek(currentDay, { weekStartsOn: 1 });
  const endDate: Date = lastDayOfWeek(currentDay, { weekStartsOn: 1 });

  let rows: React.ReactNode[]  = [];
  let days: React.ReactNode[] = [];
  let day = startDate;
  let formattedDate = "";

  const onClickCell = (day: Date) => {
    const dayFomart = format(day, DateTimeUtils.DEFAULT_FORMAT);
    onSelectCell(day, dayFomart);
  }

  const calCellClassName = (day: Date) => {
    if (isSameDay(day, new Date())) 
      return "today";
    else if (isSameDay(day, selectedDate)) 
      return "selected";
    else return "";
  }

  const dateFormat = "d";
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay: Date = day;
      const calendarDate = DateTimeUtils.toCalendarDate(cloneDay);
      const solar = new SolarDate(calendarDate);
      const lunar = solar.toLunarDate();
      days.push(
        <div
          key={day.toISOString()}
          className={`col text-center flex-v ${calCellClassName(day)}`}
          onClick={() => onClickCell(cloneDay)}
        >
          {/* render dot */}
          {daysWithEvents?.includes(cloneDay) && (
            <div className="callendar-dot"/>
          )}
          {/* render date */}
          <span className="number"> {formattedDate} </span>
          {/* render lunar day */}
          <small> {lunar.get().day} </small>
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