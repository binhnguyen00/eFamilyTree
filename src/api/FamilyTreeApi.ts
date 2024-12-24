import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class FamilyTreeApi extends BaseApi {

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

  public static exportPDF(html2pdf: string, successCB: SuccessCB, failCB?: FailCB) {
    const formData = new FormData();
    formData.append("html2pdf", html2pdf);
    return this.server.exportPDF("export/pdf", formData, successCB, failCB);
  }
}