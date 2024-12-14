import { atom } from "recoil";

export const languageState = atom({
  key: "language",
  default: "vi",
})

export const homePath = atom({
  key: "homePath",
  default: `/zapps/${import.meta.env.VITE_APP_ZALO_APP_ID}`,
})