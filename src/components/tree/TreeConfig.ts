class FamilyTreeConfig {
  nodeWidth: number; 
  nodeHeight: number;

  constructor() {
    this.nodeWidth = 150;
    this.nodeHeight = 200;
    console.log("Init tree config", this);
  }
}

const TreeConfig = new FamilyTreeConfig();

export { TreeConfig };