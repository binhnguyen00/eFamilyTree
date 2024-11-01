import moment from "moment";

export class DateTimeUtils {
  static DATE = "DD-MM-YYYY";
  static DATE_TIME = `${this.DATE} HH:mm:ss`;

  public static getNow() {
    return moment().format("YYYY-MM-DD HH:mm:ss");
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
}