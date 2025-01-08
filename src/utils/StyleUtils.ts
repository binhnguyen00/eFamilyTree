
export class StyleUtils {
  
  /**
   * Get device's screen height minus header, footer and other component's height
   * to get the result
   * @param otherComponentHeight: height of other component in pixel 
   * @return height in pixel
   */
  public static calComponentRemainingHeight(otherComponentHeight: number) {
    const root = document.documentElement

    const screenHeight = window.innerHeight;
    const header = getComputedStyle(root).getPropertyValue("--header-height");
    const footer = getComputedStyle(root).getPropertyValue("--footer-height");
    const result = screenHeight - (parseInt(header, 10) + parseInt(footer, 10) + otherComponentHeight);

    console.log(result);

    return result;
  }
}