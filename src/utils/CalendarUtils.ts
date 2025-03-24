import { lastDayOfWeek, startOfWeek } from "date-fns";

import { DateTimeUtils } from "utils";

export interface Event {
  id: number;
  name: string;
  dong_ho: string;
  from_date: string;
  to_date: string;
  place: string;
  from_lunar_date: string;
  to_lunar_date: string;
  note: string;
  albums: number[];
}

export class CalendarUtils {

  public static filterEventsByDate(events: Event[], date: Date) {
    date = DateTimeUtils.setToMidnight(date);
    const filteredEvents = events.filter((event: Event) => {
      const eventStart = DateTimeUtils.toDate(event.from_date.substring(0, 10));
      const eventEnd = DateTimeUtils.toDate(event.to_date.substring(0, 10));
      if (!eventStart || !eventEnd) return false;
      return date >= eventStart && date <= eventEnd;
    });
    return filteredEvents;
  }

  /**
     * Retrieves all unique dates within a specified week that have associated events.
     *
     * @param events - An array of Event objects to be checked for dates.
     * @param dateInWeek - A Date object representing any date within the desired week.
     * @returns An array of unique Date objects representing days within the week that have events.
     */
  public static getDaysInWeekWithEvent(events: Event[], dateInWeek: Date): Date[] {
    const startDate: Date = DateTimeUtils.setToMidnight(
      startOfWeek(dateInWeek, { weekStartsOn: 1 })
    );
    const endDate: Date = DateTimeUtils.setToMidnight(
      lastDayOfWeek(dateInWeek, { weekStartsOn: 1 })
    );

    const filteredDates: Date[] = events
      .filter((event: Event) => {
        const eventStart = DateTimeUtils.toDate(event.from_date.substring(0, 10));
        const eventEnd = DateTimeUtils.toDate(event.to_date.substring(0, 10));
        if (!eventStart || !eventEnd) return false;
        return eventStart <= endDate && eventEnd >= startDate;
      })
      .flatMap((event: Event) => {
        const eventStart = DateTimeUtils.toDate(event.from_date.substring(0, 10));
        const eventEnd = DateTimeUtils.toDate(event.to_date.substring(0, 10));
        if (!eventStart || !eventEnd) return [];

        // Collect all dates from eventStart to eventEnd
        const dates: Date[] = [];
        let currentDate = eventStart;
        while (currentDate <= eventEnd) {
          dates.push(new Date(currentDate)); // Create a copy of the current date
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        return dates;
      });

    // Remove duplicates from the list
    const uniqueDates = Array.from(new Set(filteredDates.map((date) => date.getTime()))).map(
      (time) => new Date(time)
    );

    return uniqueDates;
  }

  public static firstDayOfWeek(date: Date) {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  public static lastDayOfWeek(date: Date) {
    return lastDayOfWeek(date, { weekStartsOn: 1 });
  }
}