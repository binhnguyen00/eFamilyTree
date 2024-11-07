import { atom, selector } from "recoil";
import { ZmpSDK } from "./utils/ZmpSdk";
import { getUserInfo } from "zmp-sdk";

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    try {
      const phoneNumber = await ZmpSDK.getPhoneNumber();
      return phoneNumber || false;
    } catch (error) {
      console.error("Error fetching phone number:", error);
      return false;
    }
  },
});

export const userState = selector({
  key: "user",
  get: async () => {
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      return userInfo;
    } catch (error) {
      return {
        id: "",
        avatar: "",
        name: "Người dùng Zalo",
      };
    }
  },
});