import moment from "moment";
import { format, isSameDay } from "date-fns";

export class DateTimeUtils {
  static DATE = "dd/MM/yyyy";
  static DATE_TIME = `${this.DATE}@HH:mm:ss`;

  public static formatDefault(target: Date) {
    return format(target, this.DATE_TIME);
  }

  public static getNow() {
    return moment().format(this.DATE_TIME);
  }

  public static isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  public static isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  public static formatToDate(date: Date) {
    return format(date, this.DATE);
  }

  public static formatToDateTime(date: Date) {
    return format(date, this.DATE_TIME);
  }

  public static toDisplayDate(dateStr: string) {
    dateStr = dateStr
      .replace("@", " ")
      .substring(0, 16) // Remove seconds
    return dateStr.replace("@", " ");
  }

  public static toDate(dateStr: string) {
    const possibleFormats = [
      "YYYY-MM-DD",
      "YYYY/MM/DD",
      "DD/MM/YYYY",
      "MM/DD/YYYY",
      "DD-MM-YYYY",
      "MM-DD-YYYY",
      "YYYY-MM-DD@HH:mm:ss",
      "YYYY/MM/DD@HH:mm:ss",
      "DD/MM/YYYY@HH:mm:ss",
      "MM/DD/YYYY@HH:mm:ss",
      "DD-MM-YYYY@HH:mm:ss",
      "MM-DD-YYYY@HH:mm:ss",
    ];
    const parsedMoment = moment(dateStr, possibleFormats, true);
    if (parsedMoment.isValid()) return parsedMoment.toDate();
    else 
      throw new Error(`DateTimeUtils: Invalid date string "${dateStr}"`);
  }

  public static formatDateString(dateStr: string, format: string) {
    const parsedMoment = moment(dateStr, moment.ISO_8601, true); 
    if (!parsedMoment.isValid()) {
      const fallbackMoment = moment(dateStr);
      if (fallbackMoment.isValid()) {
        return fallbackMoment.format(format);
      }
    } else {
      return parsedMoment.format(format);
    }
    throw new Error(`DateTimeUtils: Invalid date string "${dateStr}"`);
  }

  public static formatFromDate(date: Date, format: "dd/MM/yyyy" | "dd/MM/yyyy@HH:mm:ss") {
    const parsedMoment = moment(date, format, true);
    if (parsedMoment.isValid()) return parsedMoment.toDate();
    else throw new Error("DateTimeUtils: Format Date failed");
  }

  public static currentTime(date?: Date) {
    const now = moment();
    if (!date) date = new Date();
    return moment(date)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .millisecond(now.millisecond())
      .toDate();
  }

  public static setToMidnight(date: Date) {
    return moment(date).startOf('day').toDate();
  }

  public static sortByDate(array: any[], dateField: string, reverse: boolean = false) {
    if (array.length === 0) return [] as any[];
    array.sort((a, b) => {
      return moment(b[dateField]).diff(moment(a[dateField]));
    })
    if (reverse) return array.reverse();
    else return array;
  }

  public static toCalendarDate(date: Date): { day: number; month: number; year: number } {
    const momentDate = moment(date);
    return {
      day: momentDate.date(),         // Day of the month
      month: momentDate.month() + 1,  // Months are 0-based, so add 1
      year: momentDate.year()         // Full year
    };
  };
}