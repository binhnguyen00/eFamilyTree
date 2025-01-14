import { UserSettings } from "types/user-settings";

export type AppContext = {
  appId: string;
  logedIn: boolean;
  phoneNumber: string;
  serverBaseUrl: string;
  modules: string[],
  userInfo: UserInfo,
  zaloUserInfo: ZaloUserInfo;
  settings: UserSettings;
  treeBackgroundPath: string,
  updatePhoneNumber: (phoneNumber: string) => void,
  updateZaloUserInfo: (userInfo: ZaloUserInfo) => void,
  updateSettings: (settings: UserSettings) => void
}

export type ZaloUserInfo = {
  id: string;
  name: string;
  avatar: string;
}

export type UserInfo = {
  id: number;
  name: string;
  clanId: number;
  generation: number
}