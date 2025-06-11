import React from "react";

import { OverlayContext } from "components";

export function useOverlayContext() {
  return React.useContext(OverlayContext);
}