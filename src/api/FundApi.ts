import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class FundApi extends BaseApi {
  
  public static getFunds(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId
    });
    return this.server.POST("/funds", header, body, successCB, failCB);
  }

  public static getFundById(fundId: number, userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      id: fundId,
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("/fund/info", header, body, successCB, failCB);
  }
}