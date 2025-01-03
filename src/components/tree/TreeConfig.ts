class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;
  treeWidth: number;
  treeHeight: number;

  constructor() {
    this.nodeWidth = 150;
    this.nodeHeight = 200;
    this.treeWidth = window.innerWidth;
    this.treeHeight = this.calculateTreeHeight();

    console.log("Init tree config:\n", this);
  }

  private calculateTreeHeight() {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || "0");
    const safeAreaInsetTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zaui-safe-area-inset-top') || "0");
    const totalHeaderHeight = safeAreaInsetTop + headerHeight;
    return window.innerHeight - totalHeaderHeight - 100;
  }
}

const TreeConfig = new FamilyTreeConfig();

export { TreeConfig };