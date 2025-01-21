export class CommonUtils {

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static isStringEmpty(token: string): boolean {
    return token.trim().length === 0;
  }

  static objToBase64(
    obj: File | Blob | undefined, 
    success: (base64: string) => void, 
    fail?: (error: ProgressEvent<FileReader>) => void)
  : void {
    const reader = new FileReader();

    reader.onload = () => {
      let base64 = reader.result as string;
      base64 = base64.split(',')[1];
      success(base64);
    }

    reader.onerror = (error) => {
      if (fail) fail(error);
    }

    if (!obj) {
      console.error(`${this.name}: \n\t obj is undefined`);
      return;
    } else reader.readAsDataURL(obj);
  }

  static getDivById(id: string): HTMLElement | null {
    const div = document.getElementById(id);
    if (!div) {
      console.warn(`getDivById\n div with id ${id} is not found`);
      return null;
    }
    return div;
  }
}