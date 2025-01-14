import { Theme } from "types/user-settings"

export type ThemeContext = {
  theme: Theme.DEFAULT, 
  toggleTheme: (themeCode: Theme) => {} 
}