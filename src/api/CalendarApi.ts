import { ClanEvent } from "pages/calendar/week/UICreate";
import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

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

  /**
   * @param date: dd/MM/yyyy@HH:mm:ss
   */
  public static getClanEventInDate(userId: number, clanId: number, date: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      date: date
    });
    return this.server.POST("calendar/clan/events-by-date", header, body, successCB, failCB);
  }

  public static createEvent({ userId, clanId, event, success, fail }: {
    userId: number, clanId: number, event: ClanEvent, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      event: {
        from_date: `${event.fromDate}@${event.fromTime}`,
        to_date: `${event.toDate}@${event.toTime}`,
        member_id: event.picId,
        place: event.place,
        note: event.note,
        name: event.name,
      }
    })
    return this.server.POST("calendar/clan/event/create", header, body, success, fail);
  }
  
  public static deleteEvent({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: id
    })
    return this.server.POST("calendar/clan/event/delete", header, body, success, fail);
  }

  public static saveEvent({ userId, clanId, event, success, fail }: {
    userId: number, clanId: number, event: ClanEvent, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      event: {
        id: event.id,
        from_date: `${event.fromDate}@${event.fromTime}`,
        to_date: `${event.toDate}@${event.toTime}`,
        member_id: event.picId,
        place: event.place,
        note: event.note,
        name: event.name,
      }
    })
    return this.server.POST("calendar/clan/event/save", header, body, success, fail);
  }
}