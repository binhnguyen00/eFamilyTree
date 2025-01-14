import { BaseApi } from "./BaseApi";
import { OdooRESTful } from "server";
import { FailCB, SuccessCB } from "types/server";

export class TestApi extends BaseApi {
  public static server = new OdooRESTful("http://localhost:8069");

  public static mockHTTP(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.GET("api/http/mock/setting/default", header, null, successCB, failCB);
  }

  public static getOrDefault(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const formData = new FormData();
    formData.append("phone_number", phoneNumber);
    return this.server.postWithFormData("test/account/setting", formData, successCB, failCB);
  }

  public static getDefault(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.POST("test/account/setting/default", header, null, successCB, failCB);
  }

  public static updateOrCreate(
    phoneNumber: string, 
    settings: {
      theme: string,
      language: string,
    },
    successCB: SuccessCB, 
    failCB?: FailCB
  ) {
    const formData = new FormData();
    formData.append("phone_number", phoneNumber);
    formData.append("theme", settings.theme);
    formData.append("language", settings.language);
    this.server.postWithFormData("test/account/setting/save", formData, successCB, failCB);
  }

  public static getBackground(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const formData = new FormData();
    formData.append("phone_number", phoneNumber);
    this.server.postWithFormData("test/account/setting/background", formData, successCB, failCB);
  }

  public static updateBackground(phoneNumber: string, base64: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
      base64: base64
    });
    this.server.POST("account/setting/background/save", header, body, successCB, failCB);
  }

  public static resetBackground(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
    });
    this.server.POST("account/setting/background/reset", header, body, successCB, failCB);
  }

  public static exportSVG(phoneNumber: string, blob: Blob, successCB: SuccessCB, failCB?: FailCB) {
    const formData = new FormData();
    formData.append("phone_number", phoneNumber);
    formData.append("svg", blob);
    return this.server.postWithFormData("tree/export/svg", formData, successCB, failCB);
  }
}