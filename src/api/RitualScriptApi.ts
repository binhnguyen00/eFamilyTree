import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types"

export class RitualScriptApi extends BaseApi {

  public static exportPNG(userId: number, clanId: number, base64: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      base64: base64,
    });
    return this.server.POST("petition/export/png", header, body, successCB, failCB);
  }
}