import { ZaloUserInfo } from "types/app-context";

export type AutoLoginContext = {
  logedIn: boolean;
  phoneNumber: string;
  zaloUserInfo: ZaloUserInfo;
  updatePhoneNumber: (phoneNumber: string) => void;
  updateZaloUserInfo: (zaloUserInfo: ZaloUserInfo) => void;
  refresh: () => void;
}