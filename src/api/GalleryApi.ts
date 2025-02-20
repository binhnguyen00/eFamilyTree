import { AlbumForm } from "pages/gallery/UICreateAlbum";
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

  public static createAlbum({ userId, clanId, album, success, fail }: {
    userId: number, clanId: number, album: AlbumForm, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album: {
        name: album.name,
        description: album.description,
        event_id: album.eventId,
        thumbnail: album.thumbnailBase64,
      }
    })
    this.server.POST("gallery/album/create", header, body, success, fail);
  }

  public static deleteAlbum({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: id
    })
    this.server.POST("gallery/album/delete", header, body, success, fail);
  }

  public static saveAlbum({ userId, clanId, album, success, fail }: {
    userId: number, clanId: number, album: AlbumForm, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album: {
        id: album.id,
        name: album.name,
        description: album.description,
        event_id: album.eventId,
        thumbnail: album.thumbnailBase64,
      }
    })
    this.server.POST("gallery/album/save", header, body, success, fail);
  }

  public static addImagesToAlbum({ userId, clanId, albumId, base64s, success, fail }: {
    userId: number, clanId: number, albumId: number, base64s: string[], success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album_id: albumId,
      base64s: base64s
    })
    this.server.POST("gallery/album/images/add", header, body, success, fail);
  }
}