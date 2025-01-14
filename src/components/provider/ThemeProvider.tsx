import React from "react";

import { Theme, ThemeContext as ThemeCtx } from "types/user-settings";

export const ThemeContext = React.createContext({ 
  theme: Theme.DEFAULT, 
  toggleTheme: (theme: Theme) => {} 
} as ThemeCtx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ theme, setTheme ] = React.useState<Theme>(Theme.DEFAULT);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const themeCtx = {
    theme: theme,
    toggleTheme: toggleTheme
  } as ThemeCtx;

  return (
    <ThemeContext.Provider value={themeCtx}>
      {children}
    </ThemeContext.Provider>
  );
}