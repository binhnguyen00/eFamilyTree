export class CommonUtils {

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static isStringEmpty(token: string): boolean {
    return token.trim().length === 0;
  }

  static blobToBase64(
    blob: Blob, 
    success: (base64: string) => void, 
    fail?: (error: ProgressEvent<FileReader>) => void
  ): void {
    const reader = new FileReader();

    reader.onload = () => {
      let base64 = reader.result as string
      success(base64);
    }

    reader.onerror = (error) => {
      if (fail) fail(error);
    }

    reader.readAsDataURL(blob);
  }
}