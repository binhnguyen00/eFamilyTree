import { BaseServer } from "./BaseServer";
import { SuccessCB, FailCB } from "server"

export class UserSettingApi extends BaseServer {

  public static getOrDefault(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber
    })
    return this.server.POST("account/setting", header, body, successCB, failCB);
  }

  public static getDefault(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.POST("account/setting/default", header, null, successCB, failCB);
  }

  public static updateOrCreate(
    phoneNumber: string, 
    settings: {
      theme: string,
      language: string,
    },
    successCB: SuccessCB, 
    failCB?: FailCB
  ) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
      theme: settings.theme,
      language: settings.language,
    })
    this.server.POST("account/setting/save", header, body, successCB, failCB);
  }

  public static getBackground(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber
    })
    this.server.POST("account/setting/background", header, body, successCB, failCB);
  }

  public static updateBackground(phoneNumber: string, background: FormData, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
      background: background
    })
    this.server.POST("account/setting/background/save", header, body, successCB, failCB);
  }
}