import { getSetting, getPhoneNumber, getAccessToken, getUserInfo } from 'zmp-sdk';
import { CallBack } from "./type";
import { ExternalRESTful } from "server/ExternalRESTful";

export class ZmpSDK {
  
  /** @deprecated */
  public static getPhoneNumberDeprecated(): Promise<any> {
    return new Promise((resolve, reject) => {
      getPhoneNumber({
        success: async (data) => {
          const { number, token } = data;
          if (token) {
            try {
              const response = await this.getPhoneNumberByTokenDeprecated(token);
              resolve(response.data.number.replace(/\+84|84/g, '0'));
            } catch (error) {
              reject(error);
            }
          } else {
            reject("No token provided.");
          }
        },
        fail: (error) => {
          console.error("getPhoneNumber:\n", error);
          reject(error);
        }
      });
    });
  }

  /** @deprecated */
  private static getPhoneNumberByTokenDeprecated(token: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await this.getAccessTokenDeprecated();
        const zaloHeader = {
          code: token,
          access_token: accessToken,
          secret_key: import.meta.env.VITE_APP_SECRET_KEY as string
        }
        const successCB: CallBack = (data) => resolve(data);
        const failCB: CallBack = (error) => reject(error);
        const zalo = new ExternalRESTful("https://graph.zalo.me/v2.0");
        zalo.GET("me/info", zaloHeader, null, successCB, failCB);
      } catch (error) {
        console.error("getPhoneNumberByToken:\n", error);
        reject(error);
      }
    });
  }

  /** @deprecated */
  private static getAccessTokenDeprecated(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      getAccessToken({
        success: (accessToken) => {
          resolve(accessToken);
        },
        fail: (error) => {
          console.error("getAccessToken:\n", error);
          reject(error);
        }
      });
    });
  }

  /** @deprecated */
  public static getSettingDeprecated(): Promise<any> {
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

  // New Method
  public static getUserInfo(successCB: CallBack, failCB?: CallBack) {
    getUserInfo({
      success(res) {
        successCB(res.userInfo);
      },
      fail(err) {
        if (failCB) failCB(err);
      },
    });
  }

  public static getSettings(successCB: CallBack, failCB?: CallBack) {
    getSetting({
      success(res) {
        let authSetting = res.authSetting;
        if (Object.keys(authSetting).length == 0) authSetting = {
          "scope.userInfo": false,
          "scope.userPhonenumber": false,
          "scope.userLocation": false,
          "scope.camera": false,
          "scope.micro": false
        }; 
        successCB(authSetting);
      },
      fail(err) {
        if (failCB) failCB(err);
      },
    });
  }

  public static getPhoneNumber(successCB: CallBack, failCB?: CallBack) {
    getPhoneNumber({
      success({ number, token }) {
        if (token) {
          const successPhone = (response) => {
            const number: string = response.data.number.replace(/\+84|84/g, '0');
            successCB(number);
          }
          ZmpSDK.getPhoneNumberByToken(token, successPhone, failCB);
        }
      },
      fail(error) {
        console.error("getPhoneNumber:\n\t", error);
        if (failCB) failCB(error);
      },
    })
  }

  private static getPhoneNumberByToken(token: string, successCB: CallBack, failCB?: CallBack) {
    const getPhoneNumber = (accessToken: string) => {
      const zaloHeader = {
        code: token,
        access_token: accessToken,
        secret_key: import.meta.env.VITE_APP_SECRET_KEY as string
      }
      const zalo = new ExternalRESTful("https://graph.zalo.me/v2.0");
      zalo.GET("me/info", zaloHeader, null, successCB, failCB);
    }

    const success = (accessToken: string) => { 
      getPhoneNumber(accessToken); 
    }
    const fail = (error: any) => { 
      console.error("getPhoneNumberByToken:\n\t", error);
      if (failCB) failCB(error);
    }
    
    this.getAccessToken(success, fail);
  }

  private static getAccessToken(successCB: CallBack, failCB?: CallBack) {
    getAccessToken({
      success(accessToken) {
        console.log("accessToken", accessToken);
        successCB(accessToken);
      },
      fail(error) {
        console.error("getAccessToken:\n\t", error);
        if (failCB) failCB(error);
      },
    })
  }
}