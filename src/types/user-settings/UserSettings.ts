export enum Language {
  VI = "vi",
  EN = "en"
}

export enum Theme {
  DEFAULT   = "default",
  BLUE      = "blue",
  EMERALD   = "emerald",
  SAKURA    = "sakura",
  BROWN     = "brown",
}

export type UserSettings = {
  id: number,
  theme: Theme,
  language: Language,
  background: {
    id: number,
    path: string
  };
  introductionPeriod: number;
}

export type UserSettingsContext = {
  settings: UserSettings,
  updateSettings: (settings: UserSettings) => void,
  updateBackground: (background: { id: number, path: string }) => void,
  updateTheme: (theme: Theme) => void,
  updateLanguage: (language: Language) => void,
  updateIntroductionPeriod: (introductionPeriod: number) => void,
}