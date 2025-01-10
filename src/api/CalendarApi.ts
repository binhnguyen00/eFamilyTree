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
}