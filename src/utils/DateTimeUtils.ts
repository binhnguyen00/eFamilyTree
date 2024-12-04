import moment from "moment";

export class DateTimeUtils {
  static DATE = "DD/MM/YYYY";
  static DATE_TIME = `${this.DATE} HH:mm:ss`;

  public static getNow() {
    return moment().format(this.DATE_TIME);
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

  /** @deprecated */
  public static formatFromStringDep(dateTimeStr: string, format: "DD/MM/YYYY" | "DD/MM/YYYY HH:mm:ss") {
    let parsedMoment = moment(dateTimeStr, format, true);
    if (!parsedMoment.isValid() && format === "DD/MM/YYYY") {
      parsedMoment = moment(dateTimeStr, "DD/MM/YYYY HH:mm:ss", true);
    }
    if (parsedMoment.isValid()) {
      return parsedMoment.toDate();
    } else {
      throw new Error("DateTimeUtils: Format Date from String failed");
    }
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
}