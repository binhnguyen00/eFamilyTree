export class StyleUtils {
  
  /**
   * Get device's screen height minus header, footer and other component's height
   * to get the result
   * @param otherComponentHeight: height of other component in pixel 
   * @return height in pixel
   */
  public static calComponentRemainingHeight(otherComponentHeight: number) {
    const root = document.documentElement;

    const screenHeight = window.innerHeight;

    const header = getComputedStyle(root).getPropertyValue("--header-height").trim() || "0";
    const footer = getComputedStyle(root).getPropertyValue("--footer-height").trim() || "0";
    const safeAreaTop = getComputedStyle(root).getPropertyValue("--zaui-safe-area-inset-top").trim() || "0";
    const safeAreaBottom = getComputedStyle(root).getPropertyValue("--zaui-safe-area-inset-bottom").trim() || "0";

    // Convert to numbers
    const headerHeight = parseInt(header, 10) || 0;
    const footerHeight = parseInt(footer, 10) || 0;
    const safeAreaTopHeight = parseInt(safeAreaTop, 10) || 0;
    const safeAreaBottomHeight = parseInt(safeAreaBottom, 10) || 0;

    // Calculate remaining height
    const result = screenHeight - (
      headerHeight +
      footerHeight +
      safeAreaTopHeight +
      safeAreaBottomHeight +
      otherComponentHeight
    );

    return result;
  }
}