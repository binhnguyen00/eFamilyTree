import { atom, selector } from "recoil";
import { getUserInfo } from "zmp-sdk";

export const userState = selector({
  key: "user",
  get: () =>
    getUserInfo({
      avatarType: "small",
    }),
});

export const displayNameState = atom({
  key: "displayName",
  default: "",
});
