import { atom, selector } from "recoil";
import { ZmpSDK } from "./utils/ZmpSdk";

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      const phoneNumber = await ZmpSDK.getPhoneNumber();
      if (phoneNumber) return phoneNumber;
      return "0337076898";
    }
    return false;
  },
});