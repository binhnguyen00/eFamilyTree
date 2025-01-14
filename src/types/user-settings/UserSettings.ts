import { Theme } from "components"; 

export type UserSettings = {
  theme: Theme,
  language: "vi" | "en"
  background?: {
    id: number,
    path: string
  };
}

export type UserSettingsCtx = {
  settings: UserSettings,
  updateSettings: (settings: UserSettings) => void
}