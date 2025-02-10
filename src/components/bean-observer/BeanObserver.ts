import React from "react";

export class BeanObserver<T> {
  private bean: T;
  private setBean: React.Dispatch<React.SetStateAction<T>>;

  constructor(bean: T, setBean: React.Dispatch<React.SetStateAction<T>>) {
    this.bean = bean;
    this.setBean = setBean;
  }

  getBean() { return this.bean; }

  getFieldValue(field: string) { return this.getBean()[field]; }

  getFields(): Array<keyof T> {
    const clone = this.bean as object;
    return Object.keys(clone) as Array<keyof T>;
  }

  updateBean(bean: T) {
    this.setBean(bean);
  }

  /**
   * @usage when your bean is an object
   */
  update(field: keyof T, value: T[keyof T]) {
    this.setBean((prev) => ({ 
      ...(prev as Record<string, any>), 
      [field]: value 
    }) as T);
  }

  /**
   * @usage when your bean is an array
   */
  push(index: number, value: any) {
    this.setBean((prev) => {
      const newArray = [...(prev as any[])];
      newArray[index] = value;
      return newArray as T;
    });
  }

  watch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const field = e.target.name as keyof T;
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;

    this.update(field, value as T[keyof T]);
  };
}