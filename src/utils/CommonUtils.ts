export class CommonUtils {

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static isStringEmpty(token: string): boolean {
    return token.trim().length === 0;
  }
}