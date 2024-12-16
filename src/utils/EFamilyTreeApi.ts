import { OdooRESTful } from "server/OdooRESTful";
import { FailCB, SuccessCB } from "utils";

export class EFamilyTreeApi {
  private static server = new OdooRESTful("https://giapha.mobifone5.vn");

  public static getServerBaseUrl() {
    return this.server.serverUrl;
  }

  public static mock(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.GET("api/mock/setting/default", header, null, successCB, failCB);
  }

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

  public static getMemberBlogs(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/list/blog", header, body, successCB, failCB);
  }

  public static getMemberAlbum(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/album", header, body, successCB, failCB);
  }

  public static getMemberUpcomingEvents(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/list/event", header, body, successCB, failCB);
  }

  public static getFunds(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/fund", header, body, successCB, failCB);
  }

  public static getCerificatesByGroup(phoneNumber, groupId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      type_id: groupId
    });
    return this.server.POST("get/certificates", header, body, successCB, failCB);
  }

  public static getCerificateInfo(phoneNumber, certificateId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      id: certificateId
    });
    return this.server.POST("get/info/certificate", header, body, successCB, failCB);
  }

  public static getCerificateGroups(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
    });
    return this.server.POST("get/type/certificates", header, body, successCB, failCB);
  }

  private static initBody(params: any): Record<string, any> { 
    return {
      params: params
    }
  }

  private static initHeader(): Record<string, any> {
    return {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  }
}