import { OdooRESTful } from "server";
import { FailCB, SuccessCB } from "types";

import { BaseApi } from "./BaseApi";

export class TestApi extends BaseApi {
  public static server = new OdooRESTful("http://localhost:8069");

  public static mockHTTP(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.GET("api/http/mock/setting/default", header, null, successCB, failCB);
  }
}