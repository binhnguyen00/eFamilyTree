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
  
  public static getMemberInfo({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      member_id: id,
      user_id: userId,
      clan_id: clanId,
    });
    this.server.POST("tree/member/info", header, body, success, fail);
  }

  /** @deprecated */
  public static getMember({ userId, clanId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      member_id: userId,
      clan_id: clanId,
    });
    this.server.POST("get/info/member", header, body, success, fail);
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

  public static saveMember({ userId, clanId, member, success, fail }: { userId: number, clanId: number, member: any, success: SuccessCB, fail: FailCB }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      info: member
    });
    this.server.POST("tree/member/save", header, body, success, fail);
  }

  public static deleteMember({ id, success, fail }: { id: number, success: SuccessCB, fail?: FailCB }) {
    const header = this.initHeader();
    const body = this.initBody({
      id: id
    });
    this.server.POST("tree/member/delete", header, body, success, fail);
  }
}