class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;
  founderNodeWidth: number;
  founderNodeHeight: number;

  nodePadding: number;

  nodeMaleColor: string;
  nodeFemaleColor: string;

  treeHeight: number;

  constructor() {
    this.nodeWidth = 120;
    this.nodeHeight = 200;
    this.founderNodeWidth = 220;
    this.founderNodeHeight = 100;

    this.nodePadding = 12;

    this.nodeMaleColor = "#112D4E";
    this.nodeFemaleColor = "#7D0A0A";

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