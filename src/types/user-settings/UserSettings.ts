export enum Language {
  VI = "vi",
  EN = "en"
}

export enum Theme {
  DEFAULT = "default",
  BLUE = "blue",
  EMERALD = "emerald",
}

export type UserSettings = {
  theme: Theme,
  language: Language,
  background?: {
    id: number,
    path: string
  };
}

export type UserSettingsContext = {
  settings: UserSettings,
  updateSettings: (settings: UserSettings) => void
}