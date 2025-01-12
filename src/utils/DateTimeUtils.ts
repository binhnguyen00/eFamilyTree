import moment from "moment";
import { format, isSameDay } from "date-fns";

export class DateTimeUtils {
  static DATE = "DD/MM/YYYY";
  static DATE_TIME = `${this.DATE} HH:mm:ss`;
  static DEFAULT_FORMAT = "dd/MM/yyyy@HH:mm:ss";

  public static formatDefault(target: Date) {
    return format(target, this.DEFAULT_FORMAT);
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

  public static isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.isSameDay(date, tomorrow);
  }

  public static formatTo(format: string) {
    return moment().format(format);
  }

  public static formatToDate(date: Date) {
    return moment(date).format(this.DATE);
  }

  public static formatToDateTime(date: Date) {
    return moment(date).format(this.DATE_TIME);
  }

  public static formatFromString(dateStr: string) {
    const possibleFormats = [
      "YYYY-MM-DD",
      "YYYY/MM/DD",
      "DD/MM/YYYY",
      "MM/DD/YYYY",
      "DD-MM-YYYY",
      "MM-DD-YYYY",
    ];
    const parsedMoment = moment(dateStr, possibleFormats, true);
    if (parsedMoment.isValid()) return parsedMoment.toDate();
    else 
      throw new Error(`DateTimeUtils: Invalid date string "${dateStr}"`);
  }

  public static formatDate(dateStr: string, format: string) {
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

  public static formatFromDate(date: Date, format: "DD/MM/YYYY" | "DD/MM/YYYY HH:mm:ss") {
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