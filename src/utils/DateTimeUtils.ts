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
    if (parsedMoment.isValid()) {
      return parsedMoment.toDate();
    }
    throw new Error("Invalid date time string format. Expected format: DD/MM/YYYY HH:mm:ss");
  }
}