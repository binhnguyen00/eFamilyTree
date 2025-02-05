import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

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
    this.server.POST("get/info/member", header, body, successCB, failCB);
  }

  public static exportSVG(userId: number, clanId: number, base64: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      base64: base64
    })
    this.server.POST("tree/export/svg", header, body, successCB, failCB);
  }

  public static searchDeadMember(params: { userId: number, clanId: number }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: params.userId,
      clan_id: params.clanId
    })
    this.server.POST("tree/member/dead", header, body, successCB, failCB);
  }
}