import { atom, selector } from "recoil";
import { ZmpSDK } from "./utils/zmpsdk";
import { getUserInfo } from "zmp-sdk";
import { t } from "i18next";

export const loginState = selector({
  key: "hasPhonePermission",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      try {
        const settings = await ZmpSDK.getSetting();
        if (settings) {
          const { authSetting } = settings;
          return authSetting["scope.userPhonenumber"];
        } else return false
      } catch (error) {
        console.error("Error fetching settings:", error);
        return false;
      }
    } else return false;
  },
})

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const phoneState = selector<string>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested > 0) {
      try {
        const phoneNumber = await ZmpSDK.getPhoneNumber();
        return phoneNumber || "";
      } catch (error) {
        console.error("phoneState:\n\t", error);
        return "";
      }
    }
    return "";
  },
});

export const userState = selector({
  key: "user",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    const defaultUser = {
      id: "",
      avatar: "",
      name: t("account"),
    }
    if (requested > 0) {
      try {
        const { userInfo } = await getUserInfo({ autoRequestPermission: true });
        if (userInfo.id) return userInfo;
        else return defaultUser;
      } catch (error) {
        console.error("userState:\n\t", error);
        return defaultUser;
      }
    } else return defaultUser;
  },
});

export const languageState = atom({
  key: "language",
  default: "vi",
})

export const homePath = atom({
  key: "homePath",
  default: `/zapps/${import.meta.env.VITE_APP_ZALO_APP_ID}`,
})

export const settingsState = selector({
  key: "settings",
  get: async ({ }) => {
    let defaultSetting = {
      "scope.userInfo": false,
      "scope.userPhonenumber": false,
      "scope.userLocation": false,
      "scope.camera": false,
      "scope.micro": false
    };
    const settings = await ZmpSDK.getSetting();
    if (settings) {
      const { authSetting } = settings;
      if (Object.keys(authSetting).length) return authSetting;
      else return defaultSetting;
    } else {
      return defaultSetting;
    }
  }
})

export const phonePermissionState = selector({
  key: "phonePermission",
  get: async ({ get }) => {
    const authSetting = get(settingsState);
    return authSetting["scope.userPhonenumber"];
  }
})