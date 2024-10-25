import { getSetting, getPhoneNumber } from "zmp-sdk";
import { Callback } from "./interface";
import { ExternalRESTful } from "../server/ExternalRESTful";

export class ZmpSDK {
  
  // ===================================== 
  // Phone number
  // ===================================== 
  public static getPhoneNumber(successCB: Callback, failCB?: Callback) {
    getPhoneNumber({
      success: async (data) => {
        let { number, token } = data;
        console.log(data);
        if (token) this.getPhoneNumberByToken(token, successCB, failCB);
      },
      fail: (error) => {
        console.log(error);
      }
    });
  }

  private static getPhoneNumberByToken(token: string, successCB: Callback, failCB?: Callback) {
    // const endpoint = "https://graph.zalo.me/v2.0/me/info";
    // const userAccessToken = "your_user_access_token";
    // const secretKey = "your_zalo_app_secret_key";
    const zalo = new ExternalRESTful("https://graph.zalo.me/v2.0");
    zalo.GET("me/info", {
      code: token,
      access_token: "",
      secret_key: ""
    }, null, successCB, failCB);
  }

  // ===================================== 
  // Settings
  // ===================================== 
  public static getSetting() {
    getSetting({
      success: (data) => {
      },
      fail: (error) => {
      }
    });
  }
}