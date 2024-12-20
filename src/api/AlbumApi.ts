import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class AlbumApi extends BaseApi {

  public static getAlbums(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/album", header, body, successCB, failCB);
  }
}