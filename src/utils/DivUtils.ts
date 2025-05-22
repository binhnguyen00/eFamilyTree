export class DivUtils {
  /**
   * Get device's screen height minus header, footer and other component's height
   * to get the result
   * @param otherComponentHeight: height of other component in pixel 
   * @return height in pixel
   */
  public static calculateHeight(otherComponentHeight: number) {
    const root = document.documentElement;

    const screenHeight = window.innerHeight;

    const header = getComputedStyle(root).getPropertyValue("--header-height").trim() || "0";
    const safeAreaTop = getComputedStyle(root).getPropertyValue("--zaui-safe-area-inset-top").trim() || "0";

    // Convert to numbers
    const headerHeight = parseInt(header, 10) || 0;
    const safeAreaTopHeight = parseInt(safeAreaTop, 10) || 0;

    // Calculate remaining height
    const result = screenHeight - (
      headerHeight +
      safeAreaTopHeight +
      otherComponentHeight
    );

    return result;
  }

  static getDivById(id: string): HTMLElement | null {
    const div = document.getElementById(id);
    if (!div) {
      console.warn(`getDivById\n div with id ${id} is not found`);
      return null;
    }
    return div;
  }

  static getDivsByClassName(className: string): HTMLCollectionOf<HTMLElement> {
    const divs = document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
    if (divs.length === 0) {
      console.warn(`getDivsByClassName\n no divs with class ${className} found`);
    }
    return divs;
  }
}