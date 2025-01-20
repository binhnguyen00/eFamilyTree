import React from "react";

import { BeanObserver } from "components";

export function useBeanObserver<T extends object>(initialBean: T) {
  const [ bean, setBean ] = React.useState<T>(initialBean);

  const observer = new BeanObserver(bean, setBean);

  return observer;
}