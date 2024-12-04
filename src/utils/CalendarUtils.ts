import { DateTimeUtils } from "../utils/DateTimeUtils";

export interface Event {
  name: string;
  dong_ho: string;
  id: number;
  date_begin: string;
  date_end: string;
  dia_diem: string;
  note: string;
}

export class CalendarUtils {

  public static filterEventsByDate(events: any[], date: Date) {
    date = DateTimeUtils.setToMidnight(date);
    const filteredEvents = events.filter((event: Event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin.substring(0, 10));
      const eventEnd = DateTimeUtils.formatFromString(event.date_end.substring(0, 10));
      if (date >= eventStart && date <= eventEnd) return event;
      else return;
    });
    return filteredEvents;
  }

}