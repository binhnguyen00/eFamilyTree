import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

export class GalleryApi extends BaseApi {

  public static getAlbums(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId
    })
    this.server.POST("gallery/albums", header, body, successCB, failCB);
  } 

  public static getImages(
    userId: number, 
    clanId: number, 
    fromDate: string, 
    toDate: string, 
    successCB: SuccessCB, 
    failCB?: FailCB
  ) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      from_date: fromDate,
      to_date: toDate
    })
    this.server.POST("gallery/images", header, body, successCB, failCB);
  }

  public static getImagesByAlbum(userId: number, clanId: number, albumId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album_id: albumId
    })
    this.server.POST("gallery/images-by-album", header, body, successCB, failCB);
  }

  public static getHttpImages(
    userId: number, 
    clanId: number, 
    fromDate: string, 
    toDate: string, 
    successCB: SuccessCB, 
    failCB?: FailCB
  ) {
    const body = new FormData();
    body.append("user_id", userId.toString());
    body.append("clan_id", clanId.toString());
    body.append("from_date", fromDate);
    body.append("to_date", toDate);
    this.server.postWithFormData("/http/gallery/images", body, successCB, failCB);
  }
}