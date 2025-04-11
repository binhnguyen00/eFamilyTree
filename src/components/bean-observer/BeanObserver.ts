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

  /**@usage when your bean is an object */
  update(field: keyof T, value: T[keyof T]) {
    this.setBean((prev) => ({ 
      ...(prev as Record<string, any>), 
      [field]: value 
    }) as T);
  }

  /**
   * @deprecated
   * @usage when your bean is an array
   */
  push(index: number, value: any) {
    this.setBean((prev) => {
      const newArray = [...(prev as any[])];
      newArray[index] = value;
      return newArray as T;
    });
  }

  /**@usage when updating (add) a field which is an array */
  pushToList<K extends keyof T>(field: K, value: T[K] extends Array<infer U> ? U : never) {
    this.setBean((prev) => ({
      ...(prev as Record<string, any>),
      [field]: [
        ...(prev[field] as Array<any>),
        value
      ]
    }) as T);
  }

  /**@usage when updating (remove) a field which is an array */
  removeFromList<K extends keyof T>(field: K, index: number) {
    this.setBean((prev) => ({
      ...(prev as Record<string, any>),
      [field]: (prev[field] as Array<any>).filter((_, i) => i !== index)
    }) as T);
  }
  
  /**@usage when updating a field which is an object */
  updateObject<K extends keyof T>(
    field: K, 
    objectField: keyof T[K] extends string ? keyof T[K] : never, 
    value: T[K] extends Record<string, any> ? T[K][typeof objectField] : never
  ) {
    this.setBean((prev) => ({
      ...(prev as Record<string, any>),
      [field]: {
        ...(prev[field] as Record<string, any>),
        [objectField]: value
      }
    }) as T);
  }

  watch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const field = e.target.name as keyof T;
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;

    this.update(field, value as T[keyof T]);
  };
}