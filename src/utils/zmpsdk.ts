import { getSetting, getPhoneNumber, getAccessToken } from "zmp-sdk";
import { Callback } from "./Interface";
import { ExternalRESTful } from "../server/ExternalRESTful";

export class ZmpSDK {
  
  public static getPhoneNumber(): Promise<any> {
    return new Promise((resolve, reject) => {
      getPhoneNumber({
        success: async (data) => {
          const { number, token } = data;
          if (token) {
            try {
              const response = await this.getPhoneNumberByToken(token);
              resolve(response.data.number);
            } catch (error) {
              reject(error);
            }
          } else {
            // reject("No token provided.");
          }
        },
        fail: (error) => {
          console.error(error);
          reject(error);
        }
      });
    });
  }

  private static getPhoneNumberByToken(token: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await this.getAccessToken();
        const zaloHeader = {
          code: token,
          access_token: accessToken,
          secret_key: import.meta.env.VITE_APP_SECRET_KEY as string
        }
        const successCB: Callback = (data) => resolve(data);
        const failCB: Callback = (error) => reject(error);
        const zalo = new ExternalRESTful("https://graph.zalo.me/v2.0");
        zalo.GET("me/info", zaloHeader, null, successCB, failCB);
      } catch (error) {
        reject(error);
      }
    });
  }

  private static getAccessToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      getAccessToken({
        success: (accessToken) => {
          resolve(accessToken);
        },
        fail: (error) => {
          console.error(error);
          reject(error);
        }
      });
    });
  }

  public static getSetting(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      getSetting({
        success: (data) => {
          resolve(data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
}