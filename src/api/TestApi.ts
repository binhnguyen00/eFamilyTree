import { BaseApi } from "./BaseApi";
import { OdooRESTful, FailCB, SuccessCB } from "server";

export class TestApi extends BaseApi {
  static server = new OdooRESTful("http://localhost:8069");

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

  public static updateBackground(phoneNumber: string, image: any, successCB: SuccessCB, failCB?: FailCB) {
    const formData = new FormData();
    formData.append("phone_number", phoneNumber);
    formData.append("background", image);
    this.server.postWithFormData("test/account/setting/background/save", formData, successCB, failCB);
  }
}