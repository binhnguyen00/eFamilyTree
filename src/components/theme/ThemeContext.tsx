import React from "react";

import { Theme } from "./config";

export const ThemeContext = React.createContext({ 
  theme: "default", 
  toggleTheme: (themeCode: string) => {} 
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const availableThemes: string[] = [ Theme.BLUE, Theme.GREEN, Theme.DEFAULT ];
  const [ theme, setTheme ] = React.useState("default");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const toggleTheme = (themeCode: string) => {
    setTheme(themeCode);
    if (availableThemes.includes(themeCode)) {
      document.documentElement.setAttribute('data-theme', themeCode);
    } else {
      console.error(`Theme ${themeCode} not found`);
      return;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}