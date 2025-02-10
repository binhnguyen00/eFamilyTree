import React from "react";

import { BeanObserver } from "components";

export function useBeanObserver<T extends Record<string, any>>(initialBean: T) {
  const [ bean, setBean ] = React.useState<T>(initialBean);

  const observer = new BeanObserver<T>(bean, setBean);

  return observer;
}