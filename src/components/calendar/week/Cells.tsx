import React from "react";

import { 
  addDays, format, isSameDay, lastDayOfWeek, startOfWeek 
} from "date-fns";

interface CellsProps {
  currentMonth: any;
  selectedDate: Date;
  onSelectCell: (day: Date, dayStr: string) => void;
}

export default function Cells(props: CellsProps) {
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