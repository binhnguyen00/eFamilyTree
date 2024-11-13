import { atom, selector } from "recoil";
import { ZmpSDK } from "./utils/ZmpSDK";
import { getUserInfo } from "zmp-sdk";
import { t } from "i18next";

export const logedInState = selector({
  key: "logedInState",
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

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      try {
        const phoneNumber = await ZmpSDK.getPhoneNumber();
        if (phoneNumber) {
          return phoneNumber;
        } else return false
      } catch (error) {
        console.error("Error fetching phone number:", error);
        return false;
      }
    } else return false;
  },
});

export const userState = selector({
  key: "user",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    const defaultUser = {
      id: "",
      avatar: "",
      name: t("zalo_user"),
    }
    if (requested) {
      try {
        const { userInfo } = await getUserInfo({ autoRequestPermission: true });
        return userInfo;
      } catch (error) {
        console.error("Error fetching user info:", error);
        return defaultUser;
      }
    } else return defaultUser;
  },
});