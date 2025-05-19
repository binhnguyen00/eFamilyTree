import { Language, Theme, UserSettings } from "types/user-settings";

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
  updateSettings: (settings: UserSettings) => void,
  updateTheme: (theme: Theme) => void,
  updateLanguage: (language: Language) => void,
  doLogin: () => void,
}

export type ZaloUserInfo = {
  id: string;
  name: string;
  avatar: string;
  authSettings: ZaloSettings;
}

export type ZaloSettings = {
  "scope.userInfo": boolean,
  "scope.userPhonenumber": boolean,
  "scope.userLocation": boolean,
  "scope.camera": boolean,
  "scope.micro": boolean
}

export type UserInfo = {
  id: number;
  name: string;
  clanId: number;
  clanName: string;
  generation: number
}

export enum Module {
  FUND              = "module-fund",
  CALENDAR          = "module-calendar",
  HALL_OF_FAME      = "module-hall-of-fame",
  SOCIAL_POST       = "module-social-post",
  GALLERY           = "module-gallery",
  FAMILY_TREE       = "module-family-tree",
  RITUAL_SCRIPT     = "module-ritual-script",
  MEMORIAL_LOCATION = "module-memorial-location",
  PLAYGROUND        = "module-playground",
}