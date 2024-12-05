import { atom, selector } from "recoil";
import { ZmpSDK } from "./utils/zmpsdk";
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
      name: t("account"),
    }
    if (requested) {
      try {
        const { userInfo } = await getUserInfo({ autoRequestPermission: true });
        if (userInfo.id) return userInfo;
        else return defaultUser;
      } catch (error) {
        console.error("Error fetching user info:", error);
        return defaultUser;
      }
    } else return defaultUser;
  },
});

export const languageState = atom({
  key: "language",
  default: "vi",
})

export const swipeDisabledPathsAtom = atom<string[]>({
  key: 'swipeDisabledPaths',
  default: [
    '/',              // UIHomeLayout
    '/family-tree',   // UIFamilyTree
    '/calendar',      // UICalendar

    '/demo-calendar',
  ],
});