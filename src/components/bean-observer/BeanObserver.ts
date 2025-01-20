export class BeanObserver<T> {
  private bean: T;
  private setBean: React.Dispatch<React.SetStateAction<T>>;

  constructor(bean: T, setBean: React.Dispatch<React.SetStateAction<T>>) {
    this.bean = bean;
    this.setBean = setBean;
  }

  getBean() { return this.bean; }

  getFieldValue(field: string) { return this.getBean()[field]; }

  /**
   * @usage when your bean is an object
   */
  update(field: keyof T, value: T[keyof T]) {
    this.setBean((prev) => ({ 
      ...prev, 
      [field]: value 
    }));
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
}