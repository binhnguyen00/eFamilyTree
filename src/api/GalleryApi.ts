import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

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
}