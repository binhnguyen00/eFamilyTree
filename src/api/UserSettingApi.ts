import { BaseApi } from "api";
import { SuccessCB, FailCB } from "types"

export class UserSettingApi extends BaseApi {

  public static getOrDefault({ userId, clanId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    return this.server.POST("account/setting", header, body, success, fail);
  }

  public static getDefault({ success, fail }: { success: SuccessCB, fail?: FailCB }) {
    const header = this.initHeader();
    return this.server.POST("account/setting/default", header, {}, success, fail);
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

  public static getBackground({ userId, clanId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    return this.server.POST("account/setting/background", header, body, success, fail);
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

  public static resetBackground({ clanId, userId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    this.server.POST("account/setting/background/reset", header, body, success, fail);
  }

  public static increaseIntroductionPeriod({ userId, clanId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    })
    this.server.POST("account/setting/introduction/period/increase", header, body, success, fail);
  }
}