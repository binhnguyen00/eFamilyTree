import React from "react";

import { RequestLocationContext } from "components";

export function useRequestLocationContext() {
  return React.useContext(RequestLocationContext);
}