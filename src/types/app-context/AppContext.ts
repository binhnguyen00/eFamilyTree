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
  authSettings?: {
    "scope.userInfo": boolean,
    "scope.userPhonenumber": boolean,
    "scope.userLocation": boolean,
    "scope.camera": boolean,
    "scope.micro": boolean
  }
}

export type UserInfo = {
  id: number;
  name: string;
  clanId: number;
  clanName: string;
  generation: number
}

export enum Module {
  FUND = "module-fund",
  THEME = "module-theme",
  GALLERY = "module-gallery",
  CALENDAR = "module-calendar",
  CERTIFICATE = "module-certificate",
  FAMILY_TREE = "module-family-tree",
  SOCIAL_POST = "module-social-post",
}