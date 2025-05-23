import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB, Event } from "types"

export class CalendarApi extends BaseApi {

  public static searchEventsByMonth({ userId, clanId, date, successCB, failCB }: { 
    userId: number, clanId: number, date: string, successCB: SuccessCB, failCB?: FailCB 
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id : userId,
      clan_id : clanId,
      date    : date // DD/MM/YYYY
    });
    return this.server.POST("calendar/events/search/month", header, body, successCB, failCB);
  }

  public static searchClanEvents(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("get/list/event", header, body, successCB, failCB);
  }

  /** @param date: dd/MM/yyyy */
  public static searchEventsByDate({ userId, clanId, date, successCB, failCB }: {
    userId: number, clanId: number, date: string, successCB: SuccessCB, failCB?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      date: date
    });
    return this.server.POST("calendar/events/search/date", header, body, successCB, failCB);
  }

  public static searchUpcomingEvents({ userId, clanId, date, successCB, failCB }: {
    userId: number, clanId: number, date: string, successCB: SuccessCB, failCB?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      date: date
    });
    return this.server.POST("calendar/events/search/upcoming", header, body, successCB, failCB);
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

  public static createEvent({ userId, clanId, event, success, fail }: {
    userId: number, clanId: number, event: Event, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      event: {
        name      : event.name,
        from_date : event.fromDate,
        to_date   : event.toDate,
        member_id : event.picId,
        note      : event.note,
        place     : event.place,
      }
    })
    return this.server.POST("calendar/clan/event/create", header, body, success, fail);
  }

  public static saveEvent({ userId, clanId, event, success, fail }: {
    userId: number, clanId: number, event: Event, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      event: {
        id        : event.id,
        name      : event.name,
        note      : event.note,
        place     : event.place,
        member_id : event.picId,
        from_date : event.fromDate,
        to_date   : event.toDate,
      }
    })
    return this.server.POST("calendar/clan/event/save", header, body, success, fail);
  }
}