class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;

  constructor() {
    this.nodeWidth = 150;
    this.nodeHeight = 60;
    console.log("Init tree config:\n", this);
  }
}

const TreeConfig = new FamilyTreeConfig();

export { TreeConfig };