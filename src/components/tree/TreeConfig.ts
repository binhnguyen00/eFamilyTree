class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;

  constructor() {
    this.nodeWidth = 150;
    this.nodeHeight = 200;
    console.log("Init tree config:\n", this);
  }
}

const TreeConfig = new FamilyTreeConfig();

export { TreeConfig };