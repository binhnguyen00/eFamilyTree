class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;

  constructor() {
    this.nodeWidth = 120;
    this.nodeHeight = 150;
    console.log("Init tree config:\n", this);
  }
}

const TreeConfig = new FamilyTreeConfig();

export { TreeConfig };