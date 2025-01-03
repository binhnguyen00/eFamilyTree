class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;

  treeHeight: number;

  constructor() {
    this.nodeWidth = 150;
    this.nodeHeight = 200;
    this.treeHeight = this.calculateTreeHeight();

    console.log("Init tree config:\n", this);
  }

  private calculateTreeHeight() {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || "0");
    const safeAreaInsetTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zaui-safe-area-inset-top') || "0");
    const totalHeaderHeight = safeAreaInsetTop + headerHeight;
    return window.innerHeight - totalHeaderHeight - 20;
  }
}

const TreeConfig = new FamilyTreeConfig();

export { TreeConfig };