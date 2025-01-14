import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

export class CertificateApi extends BaseApi {

  public static getByGroup(userId: number, clanId: number, groupId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      type_id: groupId
    });
    return this.server.POST("get/certificates", header, body, successCB, failCB);
  }

  public static getInfo(userId: number, clanId: number, certificateId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: certificateId
    });
    return this.server.POST("get/info/certificate", header, body, successCB, failCB);
  }

  public static getGroups(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("get/type/certificates", header, body, successCB, failCB);
  }
}