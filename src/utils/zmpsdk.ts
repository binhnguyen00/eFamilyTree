import { 
  getSetting, 
  getPhoneNumber, 
  getAccessToken, 
  getUserInfo, 
  openWebview,
  saveImageToGallery,
  downloadFile,
  getLocation,
  chooseImage,
} from 'zmp-sdk/apis';
import { ExternalRESTful } from "server";
import { CallBack } from "types";

export class ZmpSDK {
  
  public static getUserInfo({ success, fail }: {
    success: CallBack,
    fail?: CallBack
  }) {
    getUserInfo({
      autoRequestPermission: true,
      avatarType: "large",
      success(res) {
        success(res.userInfo);
      },
      fail(err) {
        if (fail) fail(err);
      },
    });
  }

  public static getAuthSettings({ successCB, failCB }: {
    successCB: CallBack, failCB?: CallBack
  }) {
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
            const number: string = response.data.number;
            successCB(`+${number}`); // output: +84942...
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

    const success = (accessToken: string) => { 
      const zaloHeader = {
        code          : token,
        access_token  : accessToken,
        secret_key    : import.meta.env.VITE_APP_SECRET_KEY as string
      }
      const zalo = new ExternalRESTful("https://graph.zalo.me/v2.0");
      zalo.GET("me/info", zaloHeader, null, successCB, failCB);
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
        successCB(accessToken);
      },
      fail(error) {
        console.error("getAccessToken:\n\t", error);
        if (failCB) failCB(error);
      },
    })
  }

  public static openWebview(url: string, successCB?: CallBack, failCB?: CallBack) {
    openWebview({
      url: url,
      config: {
        style: "normal",
        leftButton: "back",
      },
      success(res) {
        if (successCB) successCB(res);
      },
      fail(err) {
        if (failCB) failCB(err);
      },
    })
  }

  public static downloadFile(url: string, successCB?: CallBack, failCB?: CallBack) {
    downloadFile({
      url: url,
      success() {
        if (successCB) successCB({
          status: "success",
          message: "download successfully",
          data: null
        });
      },
      fail(err) {
        if (failCB) failCB(err);
      },
    })
  }

  public static saveImageToGallery(base64: string, successCB?: CallBack, failCB?: CallBack) {
    saveImageToGallery({
      imageBase64Data: base64,
      success() {
        if (successCB) successCB({
          status: "success",
          message: "download successfully",
          data: null
        });
      },
      fail: (error) => {
        if (failCB) failCB(error)
      },
    })
  }

  public static downloadImageToGallery(path: string, successCB?: CallBack, failCB?: CallBack) {
    saveImageToGallery({
      imageUrl: path,
      success() {
        if (successCB) successCB({
          status: "success",
          message: "download successfully",
          data: null
        });
      },
      fail: (error) => {
        if (failCB) failCB(error)
      },
    })
  }

  public static getLocation({ successCB, failCB }: {
    successCB: CallBack, failCB?: CallBack
  }) {
    getLocation({
      success({ token }) {
        if (token) {
          const successLocation = (res: any) => {
            if (res.error === 0) successCB(res.data);
          }
          ZmpSDK.getLocationByToken(token, successLocation, failCB)
        }
      },
      fail(err) {
        if (failCB) failCB(err);
      },
    })
  }

  private static getLocationByToken(token: string, successCB: CallBack, failCB?: CallBack) {
    const success = (accessToken: string) => { 
      const zaloHeader = {
        code: token,
        access_token: accessToken,
        secret_key: import.meta.env.VITE_APP_SECRET_KEY as string
      }
      const zalo = new ExternalRESTful("https://graph.zalo.me/v2.0");
      zalo.GET("me/info", zaloHeader, null, successCB, failCB);
    }
    
    const fail = (error: any) => { 
      console.error("getPhoneNumberByToken:\n\t", error);
      if (failCB) failCB(error);
    }

    this.getAccessToken(success, fail);
  }

  public static chooseImage({ howMany, success, fail }: {
    howMany: number, success: CallBack, fail?: CallBack
  }) {
    chooseImage({
      count: howMany,
      sourceType: ["album"],
      success(res) {
        success(res.tempFiles);
      },
      fail(err) {
        if (fail) fail(err);
      },
    })
  }
}