import React from "react";

export const ThemeContext = React.createContext({ 
  theme: "default", 
  toggleTheme: (themeCode: string) => {} 
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ theme, setTheme ] = React.useState("default");

  const toggleTheme = (themeCode: string) => {
    setTheme(themeCode);
    document.documentElement.setAttribute('data-theme', themeCode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}