import { BaseServer } from "./BaseServer";
import { SuccessCB, FailCB } from "server"

export class FamilyTreeApi extends BaseServer {

  public static getMembers(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
      const header = this.initHeader();
      const body = this.initBody({
        phone: phoneNumber
      });
      this.server.POST("get/member", header, body, successCB, failCB);
    }
  
  public static getMemberInfo(phoneNumber, memberId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      member_id: memberId
    });
    return this.server.POST("get/info/member", header, body, successCB, failCB);
  }
}