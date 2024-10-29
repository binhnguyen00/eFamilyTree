import { OdooRESTful } from "server/OdooRESTful";

export class EFamilyTreeApi {
  private static server = new OdooRESTful("https://giapha.mobifone5.vn");

  public static getMembers(phoneNumber: string) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.asyncPOST("get/member", header, body);
  }

  public static getMemberInfo(phoneNumber: string, memberId: number) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      thanh_vien_id: memberId
    });
    return this.server.asyncPOST("get/info/member", header, body);
  }

  public static getMemberBlogs(phoneNumber: string) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.asyncPOST("get/list/blog", header, body);
  }

  public static getMemberAlbum(phoneNumber: string) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.asyncPOST("get/album", header, body);
  }

  public static getMemberUpcomingEvents(phoneNumber: string) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.asyncPOST("get/events", header, body);
  }

  private static initBody(params: any): Record<string, any> { 
    return {
      params: params
    }
  }

  private static initHeader(): Record<string, any> {
    return {
      "Content-Type": "application/json; charset=UTF-8",
    }
  }

  private static getResponseResult(response: any): any {
    /* Fail Response
    {
      "jsonrpc": "2.0",
      "id": 1297312732103,
      "result": {
        "error": "Bạn không thuộc cây gia phả nào"
      }
    } */
    if (!response) return "No Response from Server!";
    if (response.result.error) {
      return response.result.error;
    } 
    return response.result as any;
  }
}