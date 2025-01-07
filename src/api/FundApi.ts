import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class FundApi extends BaseApi {
  
  public static getFunds(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId
    });
    return this.server.POST("get/fund", header, body, successCB, failCB);
  }
}