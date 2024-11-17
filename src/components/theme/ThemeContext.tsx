import React from "react";

const ThemeContext = React.createContext({ 
  theme: "default", 
  toggleTheme: (themeCode: string) => {} 
});

export const useTheme = () => React.useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ theme, setTheme ] = React.useState("default");

  const toggleTheme = (themeCode: string) => {
    setTheme(themeCode);
    document.documentElement.className = `theme-${themeCode}`;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}