import { Theme } from "types/user-settings"

export type ThemeCtx = {
  theme: Theme.DEFAULT, 
  toggleTheme: (themeCode: Theme) => {} 
}