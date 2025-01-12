import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class CalendarApi extends BaseApi {

  public static getClanEvents(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("get/list/event", header, body, successCB, failCB);
  }

  /**
   * @param date: dd/MM/yyyy@HH:mm:ss
   */
  public static getClanEventsByDate(userId: number, clanId: number, date: string, successCB: SuccessCB, failCB?: FailCB) { 
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      from_date: date,
      to_date: date,
    });
    return this.server.POST("calendar/clan/events-by-range", header, body, successCB, failCB);
  }

  /**
   * @param startWeekDate: dd/MM/yyyy@HH:mm:ss
   * @param endWeekDate: dd/MM/yyyy@HH:mm:ss
   */
  public static getClanEventInWeek(userId: number, clanId: number, startWeekDate: string, endWeekDate: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      from_date: startWeekDate,
      to_date: endWeekDate,
    });
    return this.server.POST("calendar/clan/events-by-range", header, body, successCB, failCB);
  }
}