import { BaseApi } from "./BaseApi";
import { TestApi } from "./TestApi";
import { SuccessCB, FailCB } from "server"

export class GalleryApi extends BaseApi {

  public static getAlbums(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    let body = new FormData();
    body.append("phone_number", phoneNumber);
    return this.server.postWithFormData("gallery/albums", body, successCB, failCB);
  } 

  public static getImages(phoneNumber, fromDate: string, toDate: string, successCB: SuccessCB, failCB?: FailCB) {
    let body = new FormData();
    body.append("phone_number", phoneNumber);
    body.append("from_date", fromDate);
    body.append("to_date", toDate);
    return this.server.postWithFormData("gallery/images", body, successCB, failCB);
  }

  public static getImagesByAlbum(albumId: number, successCB: SuccessCB, failCB?: FailCB) {
    let body = new FormData();
    body.append("album_id", albumId.toString());
    return this.server.postWithFormData("gallery/images-by-album", body, successCB, failCB);
  }
}  