import { AlbumForm } from "pages/gallery/UICreateAlbum";
import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

export class GalleryApi extends BaseApi {

  public static searchAlbums(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId
    })
    this.server.POST("gallery/albums", header, body, successCB, failCB);
  } 

  public static getAllImages({ userId, clanId, fromDate, toDate, success, fail }: {
    userId: number, clanId: number, fromDate: string, toDate: string, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      from_date: fromDate,
      to_date: toDate
    })
    this.server.POST("gallery/images", header, body, success, fail);
  }

  public static getImagesByAlbum({ userId, clanId, albumId, success, fail }: {
    userId: number, clanId: number, albumId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album_id: albumId
    })
    this.server.POST("gallery/images-by-album", header, body, success, fail);
  }

  public static createAlbum({ userId, clanId, album, success, fail }: {
    userId: number, clanId: number, album: AlbumForm, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album: {
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
        description: album.description,
        event_id: album.eventId,
        thumbnail: album.thumbnailBase64,
      }
    })
    this.server.POST("gallery/album/save", header, body, success, fail);
  }

  public static addPhotosToAlbum({ userId, clanId, albumId, base64s, success, fail }: {
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

  public static removeImagesFromAlbum({ userId, clanId, albumId, photoIds, success, fail }: {
    userId: number, clanId: number, albumId: number, photoIds: number[], success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      album_id: albumId,
      photo_ids: photoIds
    })
    this.server.POST("gallery/album/images/remove", header, body, success, fail);
  }
}