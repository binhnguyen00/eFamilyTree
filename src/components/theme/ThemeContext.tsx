import React from "react";

import { themes } from "./config";

export const ThemeContext = React.createContext({ 
  theme: "default", 
  toggleTheme: (themeCode: string) => {} 
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ theme, setTheme ] = React.useState("default");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const toggleTheme = (themeCode: string) => {
    setTheme(themeCode);
    if (!themes[themeCode]) {
      console.error(`Theme ${themeCode} not found`);
      return;
    };
    document.documentElement.setAttribute('data-theme', themeCode);
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}