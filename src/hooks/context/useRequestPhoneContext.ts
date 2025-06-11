import React from "react";

import { RequestPhoneContext } from "components";

export function useRequestPhoneContext() {
  return React.useContext(RequestPhoneContext);
}