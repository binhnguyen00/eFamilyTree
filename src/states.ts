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
    const requested = get(requestPhoneTriesState);
    if (requested > 0) {
      const phoneNumber = await ZmpSDK.getPhoneNumber();
      if (phoneNumber) return phoneNumber;
      console.warn("Giả lập số điện thoại mặc định: 0337076898");
      return "0337076898";
    }
    return false;
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