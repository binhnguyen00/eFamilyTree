import { BaseServer } from "./BaseServer";
import { SuccessCB, FailCB } from "server"

export class UserSettingApi extends BaseServer {

  public static get(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber
    })
    return this.server.POST("account/setting", header, body, successCB, failCB);
  }
}