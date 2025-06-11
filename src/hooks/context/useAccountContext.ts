import React from "react";

import { AccountContext } from "components";

export function useAccountContext() {
  return React.useContext(AccountContext);
}