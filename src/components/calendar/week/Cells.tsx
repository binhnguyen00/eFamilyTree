import React from "react";
import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { 
  addDays, format, isSameDay, lastDayOfWeek, startOfWeek 
} from "date-fns";
import { DateTimeUtils } from "utils";

// =============================
// CELLS
// =============================
interface CellsProps {
  daysWithEvents?: any[];
  currentDay: Date;
  selectedDate: Date;
  onSelectCell: (day: Date, dayStr: string) => void;
}

export function Cells(props: CellsProps) {
  const { currentDay, selectedDate, onSelectCell, daysWithEvents } = props;

  const startDate = React.useMemo(() => 
    startOfWeek(currentDay, { weekStartsOn: 1 }), 
    [currentDay]
  );

  const endDate = React.useMemo(() => 
    lastDayOfWeek(currentDay, { weekStartsOn: 1 }), 
    [currentDay]
  );

  let rows: React.ReactNode[]  = [];
  let cells: React.ReactNode[] = [];
  let day = startDate;

  const onClickCell = (day: Date) => {
    const newDay = DateTimeUtils.setToMidnight(day);
    const dayFomart = DateTimeUtils.formatDefault(newDay);
    onSelectCell(day, dayFomart);
  }

  let dayNumber = "";
  const dateFormat = "d";
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      dayNumber = format(day, dateFormat);
      const cloneDay = day;
      const hasEvent = daysWithEvents?.some(eventDay => isSameDay(eventDay, cloneDay)) || false;
      const isToday = isSameDay(cloneDay, new Date());
      const isSelected = isSameDay(cloneDay, selectedDate);

      cells.push(
        <Cell
          key={cloneDay.toISOString()}
          day={cloneDay}
          hasEvent={hasEvent}
          isToday={isToday}
          isSelected={isSelected}
          onClick={onClickCell}
        />
      );
      day = addDays(day, 1);
    }

    rows.push(
      <div className="row" key={day.toISOString()}>
        {cells}
      </div>
    );
    cells = [];
  }

  return (
    <div className="body">
      {rows}
    </div>
  );
}

// =============================
// SINGLE CELL
// =============================
interface CellProps {
  day: Date;
  hasEvent: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: (day: Date) => void;
}

const Cell: React.FC<CellProps> = React.memo(
  ({ day, hasEvent, isToday, isSelected, onClick }) => {
    const dayNumber = format(day, "d");
    const solar = new SolarDate(DateTimeUtils.toCalendarDate(day));
    const lunar = solar.toLunarDate();
    const className = `${isToday ? "today" : isSelected ? "selected" : ""}`;

    return (
      <div className={`col text-center flex-v ${className}`} onClick={() => onClick(day)}>
        {hasEvent && <div className="callendar-dot" />}
        <span className="number"> {dayNumber} </span>
        <small> {lunar.get().day} </small>
      </div>
    );
  }
);