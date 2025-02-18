import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"
import { Member } from "pages/family-tree/UIFamilyTreeDetails";

export class FamilyTreeApi extends BaseApi {

  public static searchMembers({ userId, clanId, success, fail }: { userId: number, clanId: number, success: SuccessCB, fail?: FailCB }) {
      const header = this.initHeader();
      const body = this.initBody({
        user_id: userId,
        clan_id: clanId
      });
      this.server.POST("tree/member/search", header, body, success, fail);
    }
  
  public static getMemberInfo({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      id: id,
      user_id: userId,
      clan_id: clanId,
    });
    this.server.POST("tree/member/info", header, body, success, fail);
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
      member: member
    });
    this.server.POST("tree/member/save", header, body, success, fail);
  }

  public static archiveMember({ userId, clanId, id, success, fail }: { userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: id
    });
    this.server.POST("tree/member/archive", header, body, success, fail);
  }

  public static createMember({ userId, clanId, member, success, fail }: { 
    userId: number, clanId: number, member: Member, success: SuccessCB, fail?: FailCB 
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      member: {
        name: member.name,
        phone: member.phone,
        gender: member.gender,
        birthday: member.birthday,
        spouses: member.spouses,
        father: member.father!,
        father_id: member.fatherId!,
        mother: member.mother!,
        mother_id: member.motherId!
      }
    });
    this.server.POST("tree/member/create", header, body, success, fail);
  }

  public static getActiveMemberIds({ userId, clanId, success, fail }: { 
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB 
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    });
    this.server.POST("tree/member/active/ids", header, body, success, fail);
  }
}