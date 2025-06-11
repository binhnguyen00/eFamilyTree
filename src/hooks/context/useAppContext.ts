import React from "react";

import { AppContext } from "components";

export function useAppContext() {
  return React.useContext(AppContext);
}