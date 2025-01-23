import { SuccessCB, FailCB } from "types/server"

import { BaseApi } from "./BaseApi";

export class MemorialMapApi extends BaseApi {

  public static search(params: {
    clan_id: number;
  }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody(params);
    this.server.POST("/memorial/location/search", header, body, successCB, failCB);
  }

  public static save(params: {
    name: string,
    description: string,
    latitude: string,
    longitude: string,
  }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody(params);
    this.server.POST("/memorial/location/create", header, body, successCB, failCB);
  }
}