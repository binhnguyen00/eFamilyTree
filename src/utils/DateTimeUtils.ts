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

  public static formatFromString(dateTimeStr: string, format: "DD/MM/YYYY" | "DD/MM/YYYY HH:mm:ss") {
    const parsedMoment = moment(dateTimeStr, format, true);
    if (parsedMoment.isValid()) return parsedMoment.toDate();
    else throw new Error("DateTimeUtils: Format Date from String failed");
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
}