import { t } from "i18next";

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

  static blobUrlsToBase64s = async (imagePaths: string[]) => {
    const base64Promises = imagePaths.map((blobUrl) => {
      return new Promise<string>((resolve) => {
        CommonUtils.blobUrlToBase64(blobUrl, (base64: string) => {
          resolve(base64);
        });
      });
    });
    const base64s = await Promise.all(base64Promises);
    return base64s;
  };

  static copyToClipboard({ value, successToast, warningToast }: { 
    value: string, 
    successToast: (content: string) => void, 
    warningToast: (content: string) => void 
  }) {
    navigator.clipboard.writeText(value)
      .then(() => successToast(t("sao chép thành công")))
      .catch((err: Error) => warningToast(t("sao chép thất bại")));
  }

  static numberToMonetary = (num: number): string => {
    if (num === 0) return "0";
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
}