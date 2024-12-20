import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class LifeEventApi extends BaseApi {

  public static getLifeEvents(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/list/event", header, body, successCB, failCB);
  }
}