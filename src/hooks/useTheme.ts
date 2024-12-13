import { useContext } from "react";
import { ThemeContext } from "components";

export const useTheme = () => useContext(ThemeContext);