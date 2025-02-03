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

  static blobUrlToBase64(
    blobUrl: string,
    success: (base64: string) => void,
    fail?: (error: any) => void
  ) {
    fetch(blobUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch blob: ${response.statusText}`);
        return response.blob();
      })
      .then((blob) => {
        this.objToBase64(blob, success, fail);
      })
      .catch((error) => fail?.(error));
  }
}