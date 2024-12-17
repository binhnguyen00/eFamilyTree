import { BaseServer } from "./BaseServer";
import { SuccessCB, FailCB } from "server"

export class CertificateApi extends BaseServer {

  public static getByGroup(phoneNumber, groupId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      type_id: groupId
    });
    return this.server.POST("get/certificates", header, body, successCB, failCB);
  }

  public static getInfo(phoneNumber, certificateId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      id: certificateId
    });
    return this.server.POST("get/info/certificate", header, body, successCB, failCB);
  }

  public static getGroups(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
    });
    return this.server.POST("get/type/certificates", header, body, successCB, failCB);
  }
}