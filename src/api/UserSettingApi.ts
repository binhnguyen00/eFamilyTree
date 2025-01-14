import { BaseApi } from "api";
import { SuccessCB, FailCB } from "types/server"

export class UserSettingApi extends BaseApi {

  public static getOrDefault(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    return this.server.POST("account/setting", header, body, successCB, failCB);
  }

  public static getDefault(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.POST("account/setting/default", header, {}, successCB, failCB);
  }

  public static updateOrCreate(
    userId: number, clanId: number,
    settings: {
      theme: string,
      language: string,
    },
    successCB: SuccessCB, 
    failCB?: FailCB
  ) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      theme: settings.theme,
      language: settings.language,
    })
    this.server.POST("account/setting/save", header, body, successCB, failCB);
  }

  public static getBackground(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    this.server.POST("account/setting/background", header, body, successCB, failCB);
  }

  public static updateBackground(userId: number, clanId: number, base64: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      base64: base64
    })
    this.server.POST("account/setting/background/save", header, body, successCB, failCB);
  }

  public static resetBackground(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    this.server.POST("account/setting/background/reset", header, body, successCB, failCB);
  }
}