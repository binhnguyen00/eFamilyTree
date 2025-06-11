import React from "react";

import { ThemeContext } from "components";

export function useTheme() {
  return React.useContext(ThemeContext);
}