import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class GalleryApi extends BaseApi {

  public static getAlbums(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber
    })
    return this.server.POST("gallery/albums", header, body, successCB, failCB);
  } 

  public static getImages(phoneNumber, fromDate: string, toDate: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
      from_date: fromDate,
      to_date: toDate
    })
    return this.server.POST("gallery/images", header, body, successCB, failCB);
  }

  public static getImagesByAlbum(phoneNumber: string, albumId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
      album_id: albumId
    })
    return this.server.POST("gallery/images-by-album", header, body, successCB, failCB);
  }
}  