import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class FamilyTreeApi extends BaseApi {

  public static getMembers(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
      const header = this.initHeader();
      const body = this.initBody({
        user_id: userId,
        clan_id: clanId
      });
      this.server.POST("get/member", header, body, successCB, failCB);
    }
  
  public static getMemberInfo(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      member_id: userId,
      clan_id: clanId
    });
    return this.server.POST("get/info/member", header, body, successCB, failCB);
  }

  public static exportSVG(userId: number, clanId: number, base64: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      base64: base64
    })
    return this.server.POST("tree/export/svg", header, body, successCB, failCB);
  }
}